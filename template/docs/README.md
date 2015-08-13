# Digital Gateway Foundation Sass/JS Template

This is a base template used to build components and styling for the digital gateway prior to integration into TFS.

## Requirements

You'll need to have the following items installed before continuing.

  * [Node.js](http://nodejs.org): Use the installer provided on the NodeJS website.
  * [Grunt](http://gruntjs.com/): Run `[sudo] npm install -g grunt-cli`
  * [Bower](http://bower.io): Run `[sudo] npm install -g bower`

## Quickstart

Once you have checked out please get all the node modules.

`npm install`

Also get all the bower components using the components required in the section below.

## Grunt Automation Components Required

Components are installed and managed using bower. Components required by the Digital Gateway are listed below:

 * [canjs]: version 2.1.1
 * [foundation]: version 5
 * [fastclick]: version 1.0.1 as dependent by foundation
 * [jquery]: version 2.1.1 as dependent by foundation
 * [jquery-placeholder]: version 2.0.8 as dependent by foundation
 * [jquery-cookie]: version 1.4.1 as dependent by foundation
 * [modernizr]: version 2.8.2
 * [underscore]: version 1.6.0
 * [momentjs]: version 2.6.0
 * [autoNumeric]: 1.9.22
 * [requirejs]: 2.1.11
 
They can be installed by calling "bower install [name]"
 
## Start Developing

After everything has all been setup, while you're working on your project, run:

`grunt build` or `grunt`

to build or watch for changes to automatically build and minify the 'app.js', 'app.css' and all other relevant app specific js/css files into the build folder for you. A statis file server will be accessible 

## Directory Structure

  * `scss/_settings.scss`: Foundation or other additional configuration settings go in here
  * `scss/app.scss`: Application specific styles go here

## CSS/SCSS Rules

  * Generally an include, sass class should prefix with the feature, component or area but
    for general items, the prefix should start with `dg-` or `$dg-`. E.g. `$dg-backing-light-color`
  * Use hyphen only and do not use under score anywhere.
  * Use lower case for all sass and css
  * `_functions.scss` from foundation provides some nice scss functions like `rem-calc`. Learn to use them.
  * Most things that we need for positioning, layouts and even icons are already available, just look up foundation's doc.
  * For a great list of icons, check out the icon list here `http://zurb.com/playground/foundation-icon-fonts-3`
  * For a list of template examples for layouts using foundation check out `http://foundation.zurb.com/templates.html`
  * For off canvas bindings, look up `http://foundation.zurb.com/docs/components/offcanvas.html#`
  * For simplicity and sizing to match the original prototype, all <p>s are replaced with <h4> or <h3> depending on sizing. 
  * Never use custom sizing anywhere. Reuse sizes on SCSS level or using existing css components.

## Sizing and em/px Rules
  
Usage of EM and PX is very specific in foundation, and for all fonts and such, please refer to `_settings.scss` as they should not be hacked everywhere. Try to reuse predefined/global sizes as much as possible.

  * Learn about Nesting, Partials, Mixins, Extend, Operators
  * Study Global Styles of foundation: http://foundation.zurb.com/docs/components/global.html
  * As a general concept, anything to do with media queries, EM should be used. However, for specific sizing within the same media type, px can be used. For example px can be used for padding if this padding is `show-for-large` only.
  * Base Em is 16px or adjustable in `_settings.scss`.

## New Html Elements and Styling

For any common html elements such as inputs, error splashes etc that could be reused, it should be built inside this template first. Then added to the kitchen sink close to where it belongs.

## JS Rules

  * Files with classes should be split with `.` and composite names should be using `_` instead of camel casing.
  * Files should always be lower casing. E.g. `my.special_ability.js`
  * Variables and functions should always be using camel casing just to really differentiate from css conventions.
  * System level things are always prefixed with `_` and should be used if you are not sure.
  * All js components are merged into one file.

## TPL & EJS Rules

  * Files should be using camel casing in the same style as how they are referenced in code. This is also to differentiate between js, and css. Obviously, if you just want to join words in one line with no casing, that is fine as well.

## Quick Snippets

### Popup

Calling a popup using the generic DG popup is easy. Simply call `createPopup(...)` with example as follows:

  createPopup("Test Popup Title", "Test Popup Body", "LEFT BUTTON", "RIGHT BUTTON", function(){
      alert("Left Button Clicked");
  }, function() {
      alert("Right Button Clicked");
  });

Popup component supports single button, and two buttons. It becomes a single button when you leave right button text null or "".

Making an ajax call is also easy. Use the dg ajax helper call to assist with error management.

### Format Mobile Input

`formatMobileInput()` is easy way to add auto formatting ability to an input for australian formatted mobile numbers.

### Fix Date Input For Old Devices

`fixDateInput()` is an easy way to make date inputs revert to attribute of type `text` for older hardwares.
