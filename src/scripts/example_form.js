class ExampleForm {
  constructor(container) {
    this.model = null;
    this.container = container;
    this.cotForm = new CotForm(this.formDefinition());
  }

  render() {
    this.cotForm.render({target: this.container});
  }

  setModel(model){
    this.model = model;
    this.cotForm.setModel(model);
  }

  formDefinition(){
    let formId = 'example_cot_form';
    return {
      id: formId, //required, a unique ID for this form
      title: 'Example Form', //optional, a title to display at the top of the form
      rootPath: '/*@echo SRC_PATH*//', //optional, only required for forms using validationtype=Phone fields
      success: (event) => {
        event.preventDefault(); //this prevents the formvalidation library from auto-submitting if all fields pass validation
        alert('You have successfully attempted to submit this form. Check the javascript console for data to submit.');
        let valuesToSubmit = this.model ? this.model.toJSON() : this.cotForm.getData();
        console.log('Got form values:', valuesToSubmit);
        //at this point you would typically do an AJAX post to some kind of API service
        return false;
      },
      useBinding: true,





      sections: [
        {
          id: "example_section_one",
          title: "Section One",
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'form_intro',
                  type: 'html',
                  html: '<p>Please enter all field values as best you can. Click <strong>submit</strong> when complete.</p>'
                }
              ]
            },
            {
              fields: [
                {
                  id: 'name', //required, used to create the dom element id
                  title: 'Full Name', //required except for type=html|button|static, the title/label for the field
                  type: 'text', //optional, enum: ['html', 'button', 'static', 'checkbox', 'radio', 'text' (default), 'daterangepicker', 'dropdown', 'multiselect', 'datetimepicker', 'textarea', 'password'], the type of field to add to the row
                  posthelptext: 'An example of a text field',
                  className: 'col-xs-12 col-sm-8', //optional, override the auto-generated css grid col classes, ex: col-xs-12
                  addclass: 'additional-class', //optional, append to the auto-generated classes
                  required: true, //optional, defaults to false
                  requiredMessage: 'You must enter your name at least!', //optional, if required is set to true, this is used as the empty error message (instead of the default)
                  infohelp: 'Your name likely consists of a first name and a surname (or last name). Some people may have more or less. Enter whatever you feel most comfortable with', //optional, help text for the field, which is shown via a tooltip for an info icon, does not apply to type=html||button
                  disabled: false, //optional, defaults to false, only applies to fields that can be disabled
                  placeholder: 'name', //optional, a placeholder string for input fields, doesn't apply if validationtype=Phone
                  htmlAttr: {maxLength:100}, //optional, when type=text||password||textarea this can be used to pass a set of html attributes, which will be set on the input element using jquery's attr method
                  bindTo:'name'
                },
                {
                  id: 'user_id',
                  type: 'static',
                  title: 'User ID',
                  value: '123QWERTY',
                  posthelptext: 'An example of a static field',
                  className: 'col-xs-12 col-sm-4'
                }
              ]
            },
            {
              fields: [
                {
                  id: 'phone',
                  title: 'Phone Number',
                  prehelptext: 'Ex: 416-123-1234', //optional, help text for the field which is always displayed, in front of the field
                  posthelptext: 'An example of a text field with validationtype set to Phone',
                  validationtype: 'Phone', //optional, enum: ['Phone', 'Email', 'URL','PostalCode'], if specified, this will automatically set the proper validators object
                  validationMessage: 'Phone numbers must be entered in a valid format', //optional, when validationtype is used or type is set to daterangepicker||datetimepicker, this can be specified to override the default error message
                  options: {preferredCountries:['ca','us']}, //optional, a raw javascript object,
                    //when type=daterangepicker||multiselect||datetimepicker OR validationtype=Phone, this is passed into the jquery constructor for the field
                    //see http://davidstutz.github.io/bootstrap-multiselect/
                    //see http://www.daterangepicker.com/
                    //see http://eonasdan.github.io/bootstrap-datetimepicker/
                    //see https://github.com/jackocnr/intl-tel-input/tree/v7.1.0#options
                  bindTo: 'phone'
                },
                {
                  id: 'email',
                  title: 'Email',
                  required: true,
                  validationtype: 'Email',
                  prehelptext: 'Ex: you@me.com',
                  posthelptext: 'An example of a text field with validationtype set to Email',
                  bindTo: 'email'
                }
              ]
            },
            {
              fields: [
                {
                  type: 'dropdown',
                  id: 'province',
                  title: 'Province of Residence',
                  required: true,
                  choices: [ //required when type=radio||checkbox||dropdown||multiselect, an array of text/value pairs, text is required, but value is not (defaults to text)
                    {text: 'Select...', value: ''},
                    {text: 'Alberta', value: 'ab'},
                    {text: 'British Columbia', value: 'bc'},
                    {text: 'Ontario', value: 'on'},
                    {text: 'Yukon', value: 'yk'}
                    ],
                  posthelptext: 'An example of a dropdown field',
                  bindTo: 'province'
                },
                {
                  id: 'postalCode',
                  title: 'Postal Code',
                  validationtype: 'PostalCode',
                  posthelptext: 'An example of a text field with validationtype set to PostalCode',
                  bindTo: 'postalCode'
                }
              ]
            },
            {
              fields: [
                {
                  type: 'datetimepicker',
                  id: 'birthday',
                  title: 'Your Date of Birth',
                  required: true,
                  posthelptext: 'An example of a datetimepicker field',
                  options: {
                    format: 'MMM DD, YYYY',
                    maxDate: new Date()
                  },
                  bindTo: 'birthday'
                },
                {
                  id: 'website',
                  title: 'Website',
                  validationtype: 'URL',
                  posthelptext: 'An example of a text field with validationtype set to URL',
                  bindTo: 'website'
                }
              ]
            }
          ]
        },
        {
          id: 'example_section_two',
          title: 'Section Two',
          className: 'example-form-section panel-default',
          rows: [
            {
              fields: [
                {
                  id: 'creditCard',
                  title: 'Enter a credit card number',
                  posthelptext: 'This is an example of a custom field validator',
                  validators: {creditCard: {message: 'Invalid credit card number entered'}},
                  bindTo: 'creditCard'
                },
                {
                  type: 'checkbox',
                  id: 'consent',
                  title: 'Consent',
                  orientation: 'horizontal', //optional, enum: ['horizontal','vertical']. default is vertical. this affects fields like radio and checkbox
                  required: true,
                  requiredMessage: 'You must give your consent',
                  posthelptext: 'This is an example of a checkbox field',
                  choices: [{text: 'I hereby consent to use of my credit card', value: 'yes'}],
                  bindTo: 'consent'
                }
              ]
            },
            {
              fields: [
                {
                  type: 'multiselect',
                  id: 'languages',
                  title: 'Indicate what languages you know',
                  posthelptext: 'This is an example of a multiselect field',
                  options: {includeSelectAllOption: true},
                  choices: [
                    {text: 'css'},
                    {text: 'html'},
                    {text: 'java'},
                    {text: 'javascript'},
                    {text: 'perl'},
                    {text: 'php'},
                    {text: 'ruby'}
                  ],
                  multiple: true, //optional, defaults to false, only applies when type=multiselect, determines if multiple selection is allowed
                  bindTo: 'languages'
                },
                {
                  type: 'radio',
                  id: 'favoriteLanguage',
                  title: 'What is your favorite?',
                  orientation: 'vertical',
                  posthelptext: 'An example of a radio field',
                  choices: [
                    {text: 'css'},
                    {text: 'html'},
                    {text: 'java'},
                    {text: 'javascript'},
                    {text: 'perl'},
                    {text: 'php'},
                    {text: 'ruby'}
                  ],
                  bindTo: 'favoriteLanguage'
                }
              ]
            },
            {
              fields: [
                {
                  type: 'daterangepicker',
                  id: 'employmentDates',
                  title: 'Dates of your CoT employment',
                  posthelptext: 'An example of a daterangepicker field',
                  validationMessage: 'You must enter a valid date range',
                  options: {
                    ranges: {
                      'Today': [moment(), moment()],
                      'Last 7 Days': [moment(), moment().subtract(7,'days')],
                      'Last 30 Days': [moment(), moment().subtract(30,'days')]
                    },
                    locale: {
                      format: 'MMM DD, YYYY',
                      separator: " - "
                    }
                  },
                  bindTo: 'employmentDates'
                },
                {
                  type: 'password',
                  id: 'secret',
                  title: 'Enter a secret',
                  posthelptext: 'An example of a password field',
                  bindTo: 'secret'
                }
              ]
            },
            {
              fields: [
                {
                  type: 'textarea',
                  id: 'comments',
                  title: 'Comments',
                  cols: '5', //optional, when type=textarea this specifies the cols attribute
                  rows: '8', //optional, when type=textarea this specifies the rows attribute
                  bindTo: 'comments'
                }
              ]
            }
          ]
        },
        {
          id: 'example_section_three',
          title: 'Section Three',
          className: 'example-form-section panel-default',
          rows: [
            {
              grid: {
                id: 'contactList', //required, an ID for the grid
                bindTo: 'contactList', //grids are bound to CotCollection objects
                title: 'Contact List', //Optional, a title for the grid
                headers: [ //an array of objects with title values, for the grid column headings
                  {title: 'Name'},
                  {title: 'Email'}
                ],
                fields: [
                  {
                    id: 'contact_name',
                    bindTo: 'contact_name'
                  },
                  {
                    id: 'contact_email',
                    bindTo: 'contact_email',
                    validationtype: 'Email'
                  }
                ]
              }
            },
            {
              fields: [
                {
                  id: 'submit_button',
                  type: 'button',
                  btnClass: 'primary', //optional, only applies when type=button, defaults to 'success', determines the bootstrap btn-x class used to style the button, valid values are here: http://getbootstrap.com/css/#buttons-options
                  glyphicon: 'glyphicon-thumbs-up',
                  title: 'Submit',
                  onclick: function(){ //optional, when type=button this specifies an onclick function
                    $('#' + formId).data('formValidation').validate(); //attempt form submission, if validation is successful, the success event is called
                    return false;
                  }
                }
              ]
            }
          ]
        }
      ]
    };
  }
}
