# Workflowy2Web

Workflowy2Web is a Chrome extension which can convert a [Workflowy](https://workflowy.com/) list representing a content outline for a website into a working prototype of that website in static HTML files. Installing the extension adds a button to the Chrome toolbar which converts the currently-viewed Workflowy list into a zipped folder containing images, stylesheets and html pages making up the prototype site.

## How to get it
The Workflowy Prototype Converter can be installed from the [QQQQQQ Chrome Web Store](https://chrome.google.com/webstore/category/apps).

## How to use it
Create your site outline in Workflowy, following some content conventions (see below). Click the button in Chrome and it will create HTML files for each of your page nodes, with divs for the content nodes within each page, zip them up and present them for download. Save and extract the zip, and load the first HTML page in a browser - pow! There's your prototype.

More specifically...
* Sign up to [Workflowy](https://workflowy.com/) if you haven't already
* Create a new list node with the title you want for your site
* Use the Content Conventions below to structure your site content under that title node
* Click on the title node, so that Workflowy focuses on it (rather than e.g. its parents)
* Click the button on the toolbar to trigger your prototype download
* Save the zip and extract it, and your prototype is ready to go
* You can apply custom styling by modifying the included "custom.css"

## Content Conventions
* Each node is converted into a separate page unless its title is 'Content' or it is beneath a node with that title.
* Nodes titled 'Content' contain the page content of the parent (Page) node.
 * If a node does not have a 'Content' node the notes attached to the page node are used as page content instead.
* Nodes under 'Content' nodes are converted into divs on the page.
* Hashtags in the notes field of each node are converted into CSS classes on the div.
 * Some built-in classes allow easy presentation of common content types.
 * Other classes can be applied and given custom styling.
 * See the Styling section below for more on both of the above.
* The notes field for each div is included on the page but hidden by default. Hit SHIFT-SPACE to show / hide them.
* A set of pages with identical content can be specified by a single node called e.g. [Page1, Page2, Page3] with a child 'Content' node and page contents as normal. The converter will create pages for all the page titles listed in the brackets, and replicate the page contents for each one.
* A page which just shows the content from one of its children can be specified by putting a node called e.g. ##ChildPageName## under its content node.
* You can force any content (nodes and lines of notes) to be ignored by the converter by prefixing it with a tilde character (~).

## Styling

Styles are contained within a "style.css" file and a "custom.css" file. The custom file is left blank for you to add in your own styling to adjust the prototype. The "style.css" file contains a set of built-in styles for particular types of content, as follows. Add the given hashtag to the notes field (Shift-Enter) on the node, and the content mentioned will appear in the div.

**QQ NEEDS CHECKING**

* #line-graph - adds a line graph image
* #bar-graph - adds a bar graph image
* #pie-chart - adds a pie chart image
* #lorem - adds a short paragraph of lorem ipsum (in fact just an image, as it's only CSS styling)

## For developers
### Running unit tests
Tests are run using [karma](http://karma-runner.github.io/0.13/index.html). You will need to [install Node.js](https://docs.npmjs.com/getting-started/installing-node) and then use npm in the main directory to install dependencies:

```
npm install
```
You will then be able to launch a single run of the tests from the command line in the main directory:
```
npm test
```
### Manual testing and debugging
Chrome extensions can be loaded in Google Chrome from the source code without having to be packaged: 
* Go to chrome://extensions/
* Enable Developer Mode
* Click the 'Load unpacked extension...' button
* Select the source directory

To debug the code:
* Open Dev Tools
* Open the 'Sources' section
* Select the Content Scripts tab
* Expand the Workflowy Prototype Converter node

### Packaging
Chrome extensions can be packaged through Google Chrome, if an update is being released the private key will be required.
* Go to chrome://extensions
* Click the 'Pack extension...' button
* Enter the root directory and if releasing an update, the private key
* Click 'Pack extension' to create the .crx
