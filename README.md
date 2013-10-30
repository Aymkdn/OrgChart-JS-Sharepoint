OrgChart-JS-Sharepoint
======================

A basic HTML/CSS/JS code to create an organizational chart with Sharepoint

# Disclaimer

This script is just a quick share of something I did in my job. You probably want to customize it based on your needs!

# Example

See the screenshots in the [examples folder](https://github.com/Aymkdn/OrgChart-JS-Sharepoint/tree/master/examples).

Quick Start
===========

## Sharepoint List

The org chart information must be stored into a Sharepoint List.     
**Why?** Because we can define more fields and we can have some accurate data (that is not the case with the AD in Sharepoint).

### Create a List

Start by creating a new basic Sharepoint List called `Org Chart`.

### Add 8 columns

Create the below columns:

  - `FirstName` - single line of text [mandatory]
  - `LastName` - single line of text [mandatory]
  - `UserID`- this must be an unique ID to identify the user; I recommend to use the `username` (in lower case, e.g. "john_doe") [mandatory]
  - `Description` - single line of text (it will be the "job title")
  - `Image` - multiple lines of text (this is an url to the picture)
  - `ManagerID` - this is the `UserID` of the manager (in lower case)
  - `Responsabilities` - if you want to store some responsabilities/details about the user

### Create your HTML page

You can create a new .aspx or .html file in the same folder than your list (e.g. `http://your.sharepoint.com/root/directory/Lists/Org Chart/Show.aspx`).

You'll have to include three JavaScript files:

  - [jQuery](http://jquery.com/)
  - [SharepointPlus](http://aymkdn.github.io/SharepointPlus/)
  - [orgchart.js](https://github.com/Aymkdn/OrgChart-JS-Sharepoint/blob/master/orgchart.js)

And the CSS file called [orgchart.css](https://github.com/Aymkdn/OrgChart-JS-Sharepoint/blob/master/orgchart.css).

And finally a simple HTML tag: `<div id="orgchart"></div>`

**OK**, so your file should include the below lines:
````html
<script type="text/javascript" src="path_to/jquery-1.9.1.min.js"></script>
<script type="text/javascript" src="path_to/sharepointplus-3.0.6.min.js"></script>
<script type="text/javascript" src="path_to/orgchart.js"></script>
<link type="text/css" rel="stylesheet" href="orgchart.css">
[...]
<div id="orgchart"></div>
````

### Configure JavaScript

Open `orgchart.js` in a text editor (like Notepad) and change the values for `__url` and `__list`.

### Create the chart

You need to pass some parameters into the URL to start drawing the chart.
Here is the list of the possible parameters:

  - `root`: it's the `UserID` of the person at the top of the chart (**mandatory**)
  - `tier`: could be `1` (the selected manager and his/her direct reports), or `2` (the selected manager, his/her direct reports and their direct reports) (**mandatory**)
  - `details`: to `true` it will show the `Responsabilities`
  - `admin`: to `true` it will make the names clickable to redirect to the EditForm.aspx of the list

So you have to call `http://your.sharepoint.com/root/directory/Lists/Org Chart/Show.aspx?tier=1&root=john_doe` to see John Doe and his direct reports.
