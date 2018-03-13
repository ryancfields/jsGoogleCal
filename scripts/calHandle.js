// Overview: 
//  The idea is to become more familiar with Google’s Javascript API.  
//  Have an interface that can download calendar data.  Use OAuth / Google Calendar JS Libraries.

// Objectives:
//  User can enter credentials and authenticate to pull data. (Google OAuth)
//  Use AJAX to update page with top five calendar events.
//  UI displays past five entries based on date range input.
//  Users can add a new entry using an input on the form UI.


// Show listUpcomingEvents is from Google's API Getting Started:
var eventButton = document.getElementById('event-button');
eventButton.onclick = handleEventClick;

function handleEventClick(event) {
    listUpcomingEvents();
}

function listUpcomingEvents() {
    gapi.client.calendar.events.list({
        'calendarId': 'primary',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }).then(function (response) {
        var events = response.result.items;
        appendPre('Upcoming events:');

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
                var event = events[i];
                var when = event.start.dateTime;
                if (!when) {
                    when = event.start.date;
                }
                appendPre(event.summary + ' (' + when + ')')
            }
        } else {
            appendPre('No upcoming events found.');
        }
    });
}



//Generate unique dates using datepicker for start / end dates.

$(function () {
    $("#datepickerStart").datepicker();
});
$(function () {
    $("#datepickerEnd").datepicker();
});

//Insert new event from form.  Perform validation (below)
function insertEvent() {
    var summary = (document.getElementById('summary').value);
    var startdatetime = (document.getElementById('startdatetime').value);
    var enddatetime = (document.getElementById('enddatetime').value);
    var location = (document.getElementById('location').value);
    var attendees = (document.getElementById('attendees').value);

    var event = {
        'summary': summary,
        'location': location,
        'description': 'Event Created using Google Calendar Portal',
        'start': {
            'dateTime': startdatetime,
            'timeZone': 'America/Los_Angeles'
        },
        'end': {
            'dateTime': enddatetime,
            'timeZone': 'America/Los_Angeles'
        },
        'recurrence': [
            'RRULE:FREQ=DAILY;COUNT=2'
          ],
         'attendees': [
             { 'email': attendees },
        ],
        'reminders': {
            'useDefault': false,
            'overrides': [
                { 'method': 'email', 'minutes': 24 * 60 },
                { 'method': 'popup', 'minutes': 10 }
            ]
        }
    };
    //Check if valid JSON:
    function IsJsonString(event) {
        try {
            JSON.parse(event);
        } catch (e) {
            return false;
        }
        return true;
    }
    
      var request = gapi.client.calendar.events.insert({
          'calendarId': 'primary',
          'resource': event
      });
    
      request.execute(function (event) {
          appendPre('Event created: ' + event.htmlLink);
      });
    

};


//Validate new event form to ensure we have valid data.
$(document).ready(function () {

    $(function () {
        $("form[name='createEvent']").validate({
            rules: {
                summary: {
                    required: true,
                },
                startdate: {
                    required: true,
                },
                enddate: {
                    required: true,
                },
                summary: {
                    required: true,
                },
                location: {
                    required: true,
                }
            },
            messages: {
                
            },

            submitHandler: function (form) {
                form.submit();
            }

        });
    });
});