# Digital Gateway Foundation Sass/JS Template

## How to Enable Validation

For any form that requires validation, simply follow the following steps:

1. At `init` function of the control, add `this.inputs = []`.
2. Add `addFormElement(this.inputs, 'fName', 'letter', 1, 'Please enter a valid first name.', ">=", null, this.element)`
3. The function takes in the array of inputs from step 1, the `name` of the field, the validation type of the field, comparison limit, error message, comparator, a data field, and the parent element where this input resides.
   Due to the way the views and elements are constructed, it is important to create the relevant form element inside the `control.options`.
   fName: {
        name: "fName",
        label: "Last Name",
        infoIconId: null,
        inputType: "text",
        value: "",
        placeholder: "",
        inputClass: "",
        pattern: null
    },
    Please note that, the `inputType` here is the actual attribute of the input, and is not the same as the validation type.
4. It is also important to do `populateFormValues(this.element, this.inputs, formValues["step" + currentStep])` so that when this step is revisited, the values can be populated back again.
5. Feel free to study these functions to understand the logic used.

## Input Validators

Validation logic is coded inside the `invalidateForm()` function in the `common.js` file. An example validation type is `letter` as shown above. Feel free to add additional input validators as needed.

It is important to add the `this.element` at the end of addFormElement function as it initialises the `clear` button and other listening functionalities. Some form elements like legal, radio and checkbox does not care that much about this argument.

Supported validations are:

0. `passwordStrength` -
   Example: addFormElement(this.inputs, 'password', 'passwordStrength', 6, 'Please enter a 6 character password with at least one capital letter, a number and a none alphanumeric character.', null, null, this.element);
            
  Default system wide min strength is a score of 75 or more. Anything below 75 is considered weak, around 80 is medium and above 95 is strong. Feel free to update the logic as you see fit inside `analysePasswordScore()` function. Please note that, we need the score to update the strength indicator.

1. `stringCompare` -
   Example: addFormElement(this.inputs, 'password2', 'stringCompare', 1, 'Please enter a valid confirm password.', null, 'password', this.element);

   String compare compares two input fields and can be used for things like `Confirm Password`.

2. `dateCompare` -
   Example: 

3. `hidden` -
   Example: 

4. `textarea` -
   Example: 

5. `text` -
   Example: 

6. `letter` -
   Example: addFormElement(this.inputs, 'fName', 'letter', 1, 'Please enter a valid first name.', ">=", null, this.element)

7. `mobile` -
   Example: addFormElement(this.inputs, 'mobile', 'mobile', 1, 'Please enter a valid mobile number.', null, null, this.element);

   The limit number field `1` and the comparator string "==" can be anything for this as inputType `mobile` uses regex.
8. `number` -
   Example:

9. `email` -
   Example: addFormElement(this.inputs, 'email', 'email', 1, 'Please enter a valid email address.', null, null, this.element);

   The limit number field `1` and the comparator string can be anything for this as inputType `email` uses regex.
10. `date` and `dob` -
   Example: addFormElement(this.inputs, 'dob', 'date', 8, "Please enter a valid date.");

   The limit number field `8` can be disregarded.
11. `checkbox` -
   Example:

12. `radio` -
   Example:

13. `legal` -
   Example:

14. `select` -
   Example: addFormElement(this.inputs, 'duration', 'select', 1, "Please select correctly.");

   The select validator just makes sure that the selected value is not `NA` or empty.
15. `month` -
   Example:

16. `year` -
   Example:
   