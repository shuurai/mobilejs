# Digital Gateway Foundation Sass/JS Template

All tpls are common snippets in the form a EJS with the exception of `popupEJS.tpl`, and gets compiled as part of the "index.html" file when built using grunt. Tpl files in the `tpl/common` folder gets picked up and compiled automatically. Tpls are usually used for things that are common and needed all the time, and for other things that is better to be loaded lazily or dynamically, store them in the `ejs/common` folder.

## How to Add a New TPL

Please follow the steps below to understand and learn the process of adding a new standard `tpl` file and how to use it.

Assumptions
