# Workflowy Prototype Converter

A Chrome extension to convert a [Workflowy](https://workflowy.com/) list into a prototype website. Installing the extension adds a button to the Chrome toolbar which converts a Workflowy list into a zipped folder containing a static website consisting of images, stylesheets and html pages.

## How to get it
The Workflowy Prototype Converter can be installed from the [Chrome Web Store](https://chrome.google.com/webstore/category/apps).

## How to use it
* Sign up to [Workflowy](https://workflowy.com/)
* Create a new list - have a look at the conversion rules below
* Click the button on the toolbar to trigger your prototype download

## Conversion rules
 * Each node is converted into a separate page unless it's title is 'Content'
 * Content nodes specify the content of the parent node
   * If a node does not have a content node the notes attached to the page node are displayed instead.
 * Nodes under content nodes are converted into divs on the page
   * Hashtags in the notes of each node and converted into CSS classes on the div
   * The entire notes field for each div is included on the page, its display can be toggled with the shortcut CTRL-SPACE
* A list of pages with identical content can be specified by a single node called e.g. [Page1, Page2, Page3] with a child content node as normal.
* A page which takes its content from one of its children can be specified by putting a node called e.g. ##ChildPageName## under its content node.
* Any content (nodes and lines of notes) can be ignored by the converter by prefixing it with ~.


## For developers
### Running unit tests
Tests are run using [karma](http://karma-runner.github.io/0.13/index.html). You will need to [install Node.js](https://docs.npmjs.com/getting-started/installing-node) and then use npm to install karma:

```
npm install -g karma
npm install -g karma-jasmine
npm install -g karma-chrome-launcher
```
You will then be able to launch the test runner from the command line in the main directory:
```
karma start
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
* Expand the Content Processor node

### Packaging
Chrome extensions can be packaged through Google Chrome, if an update is being released the private key will be required.
* Go to chrome://extensions
* Click the 'Pack extension...' button
* Enter the root directory and if releasing an update, the private key
* Click 'Pack extension' to create the .crx