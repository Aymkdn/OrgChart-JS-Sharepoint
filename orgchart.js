/*!
 * OrgChart for Sharepoint
 * Copyright 2013, Aymeric (@aymkdn)
 * Contact: http://kodono.info
 * Documentation: http://aymkdn.github.com/OrgChart-JS-Sharepoint/
 * License: GPL v2 (http://aymkdn.github.com/OrgChart-JS-Sharepoint/license.txt)
 */

/*
 * CONFIGURATION
 */

// the data must be stored into a Sharepoint List.
// If your list is called "Org Chart" and is available from "http://your.sharepoint.com/root/directory/Lists/Org Chart/AllItems.aspx"
// then the configuration will be:
var __url  = 'http://your.sharepoint.com/root/directory/';
var __list = 'Org Chart';


/*
 * CODE
 */

// FitText.js 1.1 - Copyright 2011, Dave Rupert http://daverupert.com - Released under the WTFPL license
(function(a){a.fn.fitText=function(d,b){var e=d||1,c=a.extend({minFontSize:Number.NEGATIVE_INFINITY,maxFontSize:Number.POSITIVE_INFINITY},b);return this.each(function(){var f=a(this);var g=function(){f.css("font-size",Math.max(Math.min(f.width()/(e*10),parseFloat(c.maxFontSize)),parseFloat(c.minFontSize)))};g();a(window).on("resize.fittext orientationchange.fittext",g)})}})(jQuery);

Array.prototype.unique=[].unique||function(){var o={},i,l=this.length,r=[];for(i=0;i<l;i++)o[this[i]]=this[i];for(i in o)r.push(o[i]);return r}

// look at the params
var params=window.location.search.split("&");
var __root,__tier;
if (params[0] != "") {
  params[0]=params[0].slice(1);
  for (var p=0; p<params.length; p++) {
    var s=params[p].split('=');
    switch (s[0]) {
      case "root": __root=decodeURIComponent(s[1]); break;
      case "tier": __tier=1*s[1]; break;
    }
  }
}
if (__tier) {
  $('#tier').find('option').each(function() {
    if (this.value == __tier) this.selected=true;
  });
  
  $("#orgchart").html('Loading...');
}

function getOrgData() {
  // get the data from the Org Chart
  $SP().list(__list,__url).get({fields:"ID,ManagerID,UserID,FirstName,LastName,Description,Image,Responsabilities",orderby:"LastName DESC"},function(data) {
    var html="",managers=[],manager,org=[],user=[],userID;
    for (var i=data.length; i--;) {
      manager = data[i].getAttribute("ManagerID").toLowerCase();
      if (org[manager] == undefined) org[manager]=[];
      userID=data[i].getAttribute("UserID").toLowerCase();
      user[userID] = {ID:data[i].getAttribute("ID"), UserID:userID, FirstName:data[i].getAttribute("FirstName"), LastName:data[i].getAttribute("LastName"), Responsabilities:(data[i].getAttribute("Responsabilities") || "Not defined").split("\n"), Description:(data[i].getAttribute("Description") || ""), Image:(data[i].getAttribute("Image") || "unknown.jpeg")};
      org[manager].push(userID);
      managers.push(manager);
    }
    // define the dropdown box with the managers
    managers.sort();
    managers=managers.unique();
    for (var i=0;i < managers.length; i++) html += '<option'+(__root==managers[i]?' selected="selected"':'')+' value="'+managers[i]+'">'+managers[i]+'</option>'
    $('#root').append(html);
    
    // check if we have to show the org chart
    if (__root) {
      var build=function(html,user,u,i,len,org) {
        var showDetails = (window.location.search.indexOf('details=true') > -1)
        html +='<li '+(i==-1?'id="home"':'class="'+(i+1==len?'last-one"':'"'))+'>';
        html += '<div class="individual-box">'
        html += '<div class="box '+(showDetails?"enlarge":"")+'"><div class="header">'
        // you may want to edit the below line to point the link to a place where we can find more details about the profile
        html += '<a class="screen name" id="people_'+user[u].ID+'" title="See this profile" target="_blank" href="#">'+user[u].FirstName+' '+user[u].LastName+'</a>'
        if (org[u])
          html += '<a href="?tier=1&amp;root='+u+'" target="_blank" title="Show this manager and direct reports" class="directs">'+org[u].length+'<img alt="A person" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGbSURBVEhL7ZXPS8JgGMf9n8YYeWgwZJcggkSFgqggCDoYomBUkMe6NbJDCIGBFBEKVgcJT9EhhpEUQQo5rB2yg0aHweCbuYL9cHvHYNGhwQt72Xg+z4/v8zwB+PwEfLaPvwNQlR4uK2UU8nkUjouoNWRXwbuKQL6vYppnQVGU7jBIbh2iS8AQAR+vNcxwQZPxHxCNleyZI4IION1O2RjXIDQTQ11RbSFEQDYRcQRQVAjlm2evABVCPEwAcCiJba8AwPcU+VrkXkfGkySj7SDTzvsbmk0Jik2SbIrcxX5mCcxA9zSiC+sQG5Kp0SRUj3bAB5lBjVg+inOxZcEMBVzkMqANTaWB+PEYkuk0lhdnMfptWN98QW4eDybJDgE8Yo4dIShH39HG90yuaojCAmiLJXAW7+0NGscHhXBcgL7tLIDbE8Gz918wbiIBfVdYAGXCaDB7bL1HcKdL0u8D6sXsEAW5r0FoMoUXpwhUpYXVqTFPdaAZFrvFa2cVaV8VXPW318GegHRf96SztrFpu+WI49rVXnT46R9AzOAn6ZjMH7vy9nIAAAAASUVORK5CYII="></a>'
        html += '</div>'
        html += '<div class="picture"><img src="'+user[u].Image+'" alt="picture of '+user[u].LastName+', '+user[u].FirstName+'"></div>'
        html += '<div style="overflow:hidden"><p class="description">'+(user[u].Description||"")+'</p></div>'
        if (__currentUser.toLowerCase() == u)
          html += '<div class="myself"><a class="unvisited" href="EditForm.aspx?ID='+user[u].ID+'&amp;Source='+encodeURIComponent(window.location.href)+'" title="Edit your profile">Edit your profile</a></div>'
        html += '<div class="responsabilities"><ul><li>'+user[u].Responsabilities.join('<li>')+'</ul></div>'
        html += '</div>'
        return html
      }
      html='<ul id="primaryNav">';
      var i=-1,u=__root,len=org[__root].length;
      do {
        if (i>-1) u=org[__root][i];
        html = build(html,user,u,i,len,org);
        // if we want another layer and it's a manager then
        if (i>-1 && __tier>1 && managers.indexOf(u) > -1) {
          for (var j=0; j<org[u].length; j++) {
            html += '<ul>';
            html = build(html,user,org[u][j],j,org[u].length,org);
            // if we want another layer and it's a manager then
            if (__tier>2 && managers.indexOf(user[org[u][j]].UserID) > -1) {
              var direct = user[org[u][j]].UserID;
              for (var k=0; k<org[direct].length; k++) {
                html += '<ul>';
                html = build(html,user,org[direct][k],k,org[direct].length,org);
                html += '</li></ul>';
              }
            }
            html += '</li></ul>';
          }
        }
        html+='</li>';
        i++;
      } while(i < len);
      html+='</ul>';
      $('#orgchart').html(html);
      // resize the description size
      $('.description').fitText(0.8)
      // when the mouse is over our own card
      var $box=$('.myself').closest('.box');
      $box.on('mouseenter', function() { $(this).find('.myself').show() }).on('mouseleave', function() { $(this).find('.myself').hide() })
      // if admin=true then we can click on the name to edit it
      if (window.location.href.search("admin=true") != -1) 
        $('a.name').each(function() { this.href="EditForm.aspx?Source="+encodeURIComponent(window.location.href)+"&ID="+this.id.replace(/people_/,""); });
    }
  })
}

// find the current user
var __currentUser=sessionStorage.getItem("orgchart-current-username");
if (!__currentUser) {
  $SP().whoami(function(d) {
    __currentUser = d["UserName"];
    sessionStorage.setItem("orgchart-current-username", __currentUser)
    getOrgData()
  })
} else getOrgData()