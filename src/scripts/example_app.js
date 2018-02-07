class SampleApp extends (window['CotApp'] || window['cot_app']) {
  constructor() {
    super();
    this.$container = $('#bdit_plotly_core_test_container');
    this.currentlySelectedSection = '';
    this.renderedSections = {};
  }

  render() {
    //@if !IS_EMBEDDED
    super.render(); //this function only exists in cot_app
    //@endif

    this.startRouter();

  }

  startRouter() {
    new (Backbone.Router.extend({
      routes: {
        "": () => {
          this.showSection('welcome');
        },
        ":sectionName": (sectionName) => {
          let parts = sectionName.split('_');
          if (parts.length > 1 && this.$('#'+sectionName).length === 1) {
            this.showSection(parts[parts.length-1]);
          } else {
            this.showSection('welcome');
          }
        }
      }
    }))();
    Backbone.history.start();
  }

  showSection(sectionId){
    this.$('#bdit_plotly_core_test_' + this.currentlySelectedSection).hide();
    this.$('a[href*="#bdit_plotly_core_test_"]').removeClass('selected-section');
    this.$('#bdit_plotly_core_test_' + sectionId).show();
    this.$(`a[href="#bdit_plotly_core_test_${sectionId}"]`).addClass('selected-section');
    this.currentlySelectedSection = sectionId;
    if (!this.renderedSections[sectionId] && typeof this['renderExampleSection_' + sectionId] === 'function') {
      this['renderExampleSection_' + sectionId]();
      this.renderedSections[sectionId] = true;
    }
  }

  renderExampleSection_form(){
    let form = new ExampleForm(this.$('#bdit_plotly_core_test_form > div'));
    form.render();
    this.$('#bdit_plotly_core_test_form > p > button').on('click', function(){
      form.setModel(new CotModel({
        name: 'John Doe',
        phone: '416-555-5555',
        email: 'user@domain.com',
        province: 'ab',
        postalCode: 'H0H0H0',
        birthday: 'Jan 01, 1977',
        website: 'http://www.domain.com',

        creditCard: '',
        languages: ['javascript', 'css', 'html'],
        favoriteLanguage: 'javascript',
        employmentDates: 'Sep 01, 2016 - Sep 01, 2017',
        secret: 'my secret',
        consent: ['yes'],
        comments: '',
        contactList: new CotCollection([
          {
            contact_name: 'Tom Tune',
            contact_email: 'tom@gmail.com'
          }
        ])
      }));
    });
  }

  renderExampleSection_map() {
    let map = new ExampleGoogleMap(this.$('#bdit_plotly_core_test_map > div'),false);
    map.render();
    map.addMarker({
      title: 'Example Item 1',
      description: 'This is an example description of item 1',
      lat: 43.721459,
      lng: -79.373903
    });
    map.addMarker({
      title: 'Example Item 2',
      description: 'This is another example description, for item 2.',
      lat: 43.723500,
      lng: -79.374903
    });
    map.addMarker({
      title: 'Example Item 3',
      description: 'This is item 3.',
      lat: 43.795,
      lng: -79.318
    });
  }

  renderExampleSection_calendar() {
    this.$('#bdit_plotly_core_test_calendar > div').fullCalendar({
      theme: false,
      contentHeight: 'auto',
      header: {left: 'prev,next today', center: 'title', right: 'month,agendaWeek,agendaDay'},
      prev: 'left-single-arrow',
      next: 'right-single-arrow',
      editable: false,
      eventLimit: 2,
      views: {agenda: {eventLimit: 12}},
      events: [{
        title: 'Example Event Title',
        color: "blue",
        textColor: "white",
        url: '#',
        start: new Date().toISOString(),
        end: (new Date((new Date()).getTime() + 100000000)).toISOString()
      }],
      eventClick: function(calEvent, clickEvent) {
        alert('You clicked an event: ' + calEvent.title);
        return false;
      }
    });
  }

  //@if !IS_EMBEDDED
  renderExampleSection_login() {
    let login = new cot_login({
      appName: 'my_app', //Required, the name of your app, this will be sent to the CC AuthSession API call to login
      ccRoot: 'https://was-intra-sit.toronto.ca', //Optional, defaults to '' (the current protocol and domain will be used), use this to specify the <protocol>:://<domain> to use for the CC AuthSession API call
      ccPath: '', //Optional, when specified, this overrides the ccApiPath option of CotSession
      ccEndpoint: '', //Optional, when specified, this overrides the ccApiEndpoint option of CotSession
      welcomeSelector: '#bdit_plotly_core_test_login > div', //Optional, a jquery selector string for the element where the login/logout information should be displayed
      loginMessage: 'Because this is only an example, this login will fail every time.', //Optional, an HTML string to display on the login form, this can be used to explain to the user why they are logging in
      onLogin: function(cot_login_instance) {
        //Optional, a function that will be called after the user logs in successfully
      }
    });
    login.showLogin();
  }
  //@endif

  renderExampleSection_modals() {
    this.$('#bdit_plotly_core_test_modals')
      .append('<p>You can use the showModal method of CotApp or cot_app to show AODA-compliant modal dialogs. Here are some examples:</p>')
      .append($('<button class="btn btn-info">Show a simple modal dialog</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['cot_app']).showModal({
            title: 'A simple dialog',
            body: '<p>This is a paragraph in the <strong>dialog</strong> box.</p>',
            originatingElement: $(clickEvent.currentTarget)
          });
        })
      )
      .append($('<button class="btn btn-info">Show a more complex modal dialog</button>')
        .on('click', function (clickEvent) {
          (window['CotApp'] || window['cot_app']).showModal({
            title: 'A complex dialog',
            body: '<p>This is the dialog body.</p>',
            footerButtonsHtml: '<button class="btn btn-default" type="button" data-dismiss="modal">Cancel</button><button class="btn btn-primary" type="button" data-dismiss="modal">Ok</button>',
            modalSize: 'modal-sm',
            originatingElement: $(clickEvent.currentTarget),
            className: 'custom-modal',
            onShow: function () {

            },
            onShown: function () {
              $('.custom-modal .modal-body').append('<p>This paragraph was added after the modal was shown</p>');
            },
            onHide: function () {
            },
            onHidden: function () {
            }
          });
        })
      );
  }

  renderExampleSection_bootbox(){
    this.$('#bdit_plotly_core_test_bootbox button').on('click', function() {
      bootbox.prompt("Enter your name (sample prompt)", function(result){ alert(`You entered ${result}`); });
    });
  }

  renderExampleSection_tac(){
    let containerSelector = '#bdit_plotly_core_test_tac > div';
    (window['CotApp'] || window['cot_app']).showTerms({
      termsText: '<p>You must agree to the following terms and conditions: blah blah...</p>',
      disagreedText: 'Why won\'t you agree?',
      agreedCookieName: 'example_tac_cookie',
      containerSelector,
      onAgreed: (termsWereShown) => {
        if (termsWereShown) {
          alert('Thanks for agreeing!');
        } else {
          this.$(containerSelector)
            .append('<p>You previously agreed to the terms and conditions.</p>');
        }
        this.$(containerSelector)
          .append('<p>Now there is a cookie on your browser that remembers that you agreed.</p>')
          .append($('<button class="btn btn-info">Reset the terms and conditions cookie</button>')
            .on('click', function () {
              $.cookie('example_tac_cookie', '');
              document.location.reload();
            })
          );
      },
      onDisagreed: function () {
        alert('You chose not to agree');
      },
      agreementTitle: 'Terms of Use Agreement'
    });
  }

  $(selector) {
    return this.$container.find(selector);
  }
}
