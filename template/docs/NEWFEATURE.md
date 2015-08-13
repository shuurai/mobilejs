# Digital Gateway Foundation Sass/JS Template

## How to Add a New Feature

Please follow the steps below to understand and learn the process of adding a new standard feature.

Assumptions

Feature Name: `Dashboard`

Let's assume we are going to create a feature called `Dashboard`.

1. Edit `/js/config.js`, and add `FEATURE_DASHBOARD` below the feature constants. The name of the feature is capitalized and prefixed by `FEATURE_`.

2. Make a copy of `_template_feature.js` inside `/js/features` and name it `dashboard.js`.

3. Make a copy of `_template_feature_str.js` inside `/js/features` and name it `dashboard_str.en.js`. Please note the language midfix `en` denotes the language that we are using now. For chinese `gb` then we should name it `dashboard_str.gb.js`.

4. Now that we created the required files, we need to make edits.

5. Edit `dashboard_str.en.js`, change the comments header, update the string variable to `dashboardStrEN`. Make the necessary modifications to the dictionary as you need.

5. Edit `dashboard.js` and update the `initDictionary()` to initialize `dashboardStrEN`. Also make the necessary edits to the comment header.

6. Create a folder in `ejs/features` and call it `dashboard`. All features should have their own unique feature folder in side EJS. EJS is like a view (page) that is dynamically loaded. For each view (page), we will need a unique ejs.
   
   The EJS file needs to be edited carefully on the div nodes and classes. The way the class inheritence needs to be carefully tagged so to keep css restricted within areas of relevance. 

   Key areas to look at with relevance to `dashboard.scss`:

   * `<section ...>` id and its class
   * `<div ...>` div class right inside a `<row>` where the main contents are.

7. For EJS views or elements that are shared across features, place them inside `ejs/features/common`.

8. If this feature uses specific images only needed inside this feature, place the image inside `/img/dashboard/`. Just like the EJS, the `dashboard` folder has to be created of course. The idea is to basically structure the site so that it is classed and clean.

9. Create the sass file for dashboard `_dashboard.scss` inside `/scss/features/` folder. Copy the common things from another feature as required. Please make sure that the contents inside the sass file follows our CSS convention and rules. Take special note to the prefixing concept. Make sure you edit `app.scss` and `@import "features/dashboard";` like the others.

10. `/tpl` folder contains the common templates and EJS templates that are preloaded, all files here are combined into `index.html` on compile using grunt. Only put EJS templates that need to be preloaded here inside the `/tpl/common` folder.

11. IMPORTANT! This step is the most important, because if you don't do this, the feature does not get compiled by grunt.

   a. Edit `Gruntfile.js` and look for the `uglify` block.
   b. Add a line at the feature block, and include the dashboard files:
      'js/features/dashboard.min.js': ['js/features/dashboard_str.en.js','js/features/dashboard.js'],

      What this does is that, it joins and combines the dashboard files into one file called `dashboard.min.js` and this file is dynamically loaded by require in the run time as the user browses to this page.
   c. Restart grunt and let the whole site build.

12. Once you have completed this feature, you can call this feature by calling `loadFeature(FEATURE_DASHBOARD)` from anywhere in the application. Due to the page sliding mechanism, it is important that everything you do follows the page sliding paradigm. You can probably test this using Chrome's console.

13. NOTE! A feature can be loaded with a forced page slide direction by adding an argument at the end of the call: `loadFeature(FEATURE_HOME, { forceDirection: 'left' })`. The two directions available are `left` and `right`.

##TRICKS

Feature structure is designed so that feature can jump in between features with data feeding during the jumps. Some customized feature tricks are listed below (for login hook).

1. 