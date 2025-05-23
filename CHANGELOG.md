# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.15.0] - 2025-05-23

### Added

* Patterns page acceleration (#592)
* Triggers/metric state tooltips (#591)
* Metrics graph (#589)
* System tags subscriptions (#585)
* Contact noisiness statistics (#577)

## [2.14.1] - 2025-02-14

### Added

* Trigger noisiness statistics (#575)

## [2.14.0] - 2024-12-13

### Added

* Handle full team deletion (#553)
* All teams page (#561)
* Christmas mood (#564)
* Dark theme (#562)

## [2.13.0] - 2024-09-20

### Added

* Increased contact events time range (7 days now instead of 2 before) (2024-09-17) (#533)
* Trigger events filters (2024-09-12) (#532)
* Subscription transfer (user->team) button (2024-08-29) (#528)

## [2.12.0] - 2024-07-26

### Added

* Contact events noisiness statistics (#526)

## [2.11.1] - 2024-07-05

### Added

* Admin page with all contacts (#515)
* Previously hidden pages (/notifications, /patterns, /tags) are now available for admins, and hidden from ordinary users(#514)
* Custom contact name field (#513)

## [2.11.0] - 2024-04-19

### Added

* Subscription sortings and filters on settings page (#493)

## [2.10.2] - 2024-04-12

### Fixes

* Fixed render targets with crypto Api ids in non-secure browser context (#504)

## [2.10.1] - 2024-04-05

### Fixes

* Fixed allTagsSubscription toggle render (#500)

## [2.10.0] - 2024-03-29

### Added

* Improved /tags page with react-window, an ability to change susbcription, sorting buttons (#491) (2024-03-28)
* Turn off notifications modal (#488) (2024-03-13)
* Notification settings mobile page (#484) (2024-02-26)
* E2E playwright tests (#473) (2024-02-21)
* Multi cluster select (#485) (2024-02-19)
* Editable team name (#481) (2024-02-13)
* Storybook update (#479) (2024-02-12)
* Replaced encodeURI with encodeURIcomponent (#480) (2024-02-09)
* Trigger operations btns redesign (#477) (2024-01-23)
* Sentry (#476) (2024-01-22)
* Removed metric value field (#475) (2024-01-22)
* Metrics status indicator (#472) (2024-01-10)
* Playwright screenshot tests (#466) (2023-12-18)
* Source maps (#468) (2023-12-14)
* Added sortings via name/value/event on triggers page, fixed metriclist layout, added initial render with "event" sorted state (#469) (2023-12-13)
* Team description markdown support (#461) (2023-11-21)
* Validate schedule abscence (#460) (2023-11-20)
* Triggers list button (#455) (2023-11-07)
* Copy target button (#446) (2023-10-30)

### Fixes

* Fixed browser back arrow behavior at settings page (#463) (2023-11-30)
* Fix double error message (#454) (2023-11-01)


## [2.9.0] - 2023-10-25

### Added

* Add pretty editor and display for targets #440 (by @EduardZaydler)
* Add prometheus triggers #413 (by @tetrergeru)
* Add confirm deleting modal before deleting all notifications #424 (by @EduardZaydler)
* When channel deleted subscription is displayed as broken #426 (by @EduardZaydler)

### Fixes

* Metric list rows visually overlapping on desktop #421 (by @sol-un)
* Deleting metric with non-url simbols #428 (by @EduardZaydler)
* Update dependencies (by @EduardZaydler)

## [2.8.4] - 2023-09-12

### Fixed

* Fix metric list height (#425) 
* Fix metric list rows visually overlapping on desktop (#421)

## [2.8.3] - 2023-08-28

### Added
* Change PR Action logic to trigger build from comment and support build on forks (#401)
* Some buttons can now be hidden with feature-flags (#402)
* Optimize long metric list render (#415)


### Fixed
* Fix target values on mobile (#412)

## [2.7.2] - 2022-12-08

### Added

* Issue and pull request templates #377
* Creevey now runs in Docker, no Browserstack required #387
* Click action on tags in trigger list & view #384
* Mattermost as a delivery channel option #396

### Fixed

* Markdown not working in the mobile version #374
* Interface inconsistencies in some modals #376 #383
* Readme wording #380
* Some deprecated bundling logic #382
* Last event date format #389
* Search by non-existent tags #353 #394
* Trigger list item styles on hover #390
* A bottleneck in trigger list rendering #391

## [2.7.1] - 2022-07-21

### Added

* Trigger, contact and subscription can be imported and exported from a JSON file #322
* Switch from Travis CI to GitHub actions #344.
* Ability to set custom maintenance time #329.
* Migrate to Typescipt #337.
* Schedule timezone visible on the Trigger page #286.
* Filter by tag on the Notifications page #328.
* Status indicator can show up to four statuses #297.
* Sorting in Trigger and Metric columns on the Patterns page #292.
* Unsupported contacts will be marked as deprecated #321.
* Ability to receive a trigger from Moira API with a description prepared by template #484 #287.
* Teams and team-specific subscriptions #346.
* State change indicators on the Notifications page
* Notifications count on the Notifications page

### Fixed

* Move buttons to the top of the Notifications page #354.
* Update setup instructions #296 #301.
* TTL validation not working on the trigger edit page #341.
* Maintenance time setting #320.
* Trigger validation on backend will run before saving #358.
* Enable/disable notifications toggle #355.
* Maintenance setting and notifications list filtered by tag #333.
* Maintenance and delete buttons in triggers list #284.
* Errors in stories #306.
* Duplicating element keys
* Radiogroup on the Add Trigger page #316.
* iOS interface #357.

## [2.5.1] - 2019-10-09

### Added

* Ability to subscribe for all triggers without specifying tags #236.
* Ability to send markdown for discord, email, pushover, slack and telegram senders #353.
* ⚡️✨💫🔥🔥🔥 Graphs now support emojis #333.
* Y-axis graph now uses algorithm to define “beautiful” ticks #217.

### Fixed

* Added support for magic -1 timestamp #426.
* Incorrect timezone in maintenance notification text #356.
* Dependency management switched to Go modules mechanism #423.
* Linter was switched to GolangCI Lint #436.
* Go version was switched to 1.13.1 #435.
* Alert which contain NODATA now uses timestamp of NODATA detection instead of data loose time #355.
* Readyness and liveness probes delay was upgraded in helm chart to fit long triggers indexing in database moira-alert/helmcharts#2.
* API now exits with error if unable to index triggers for full-text search #327.
* Deleting tags that are used in existing subscriptions is now disallowed #344.

## [2.5.0] - 2019-04-12

### Added

* Graphite tags support #142.
* Reworked Trigger search input control in web UI. Fulltext search is now available, as long as the old tag filters #185.
* Webhook sender #123. For more info see documantation.
* Information who and when turned on maintenance mode. You can see it as a hint in web UI near the metric, and in metric alert message #192.
* A meaningful title to all Moira web pages #177.
* Environment variable that customizes api URL path for web UI Docker image #173.
* New variables to script sender. Variable ${trigger_name} is now deprecated, removed from documentation and will be removed in the future versions of Moira #228. For more information about new variables and script configuration see documantation.


## [2.4.0] - 2018-12-25

### Added

* Timeseries graphs in notifications #148. See more: Plotting
* Add api method GET trigger/{{triggerId}}/render to imlement timeseries plotting in api #137
* Add maintenance for a whole trigger. Add new api method PUT trigger/{{triggerId}}/setMaintenance. PUT trigger/{{triggerId}}/maintenance is deprecated now #138, moira-alert/web2.0#199
* Add extra maintenance intervals: 14 and 30 days moira-alert/web2.0#198
* Add option to mute notifications about new metrics in the trigger #120. See more: Dealing with NODATA
* Allow user to remove all NODATA metrics from trigger #124
* Check Lazy triggers (triggers without any subscriptions) less frequently #131. See more: Lazy Triggers Checker
* Run single NODATA checker worker at single moment #129
* Avoid throttling of remote-triggers when trigger switches to EXCEPTION and back to OK #121
* Consider the status of the trigger when rendering the trigger status indicator moira-alert/web2.0#195
* Replace useless trigger export button with "Duplicate" moira-alert/web2.0#189
* Add Moira-Notifier toggle on Hidden Pages moira-alert/web2.0#191
* Please, read Self State Monitor first.
* Show contact type icon on Hidden Pages moira-alert/web2.0#196
* Show TTL and TTLState in Advanced mode moira-alert/web2.0#197
* Throw an exception if first target is no longer valid #122
* Refactor cli. Remove old converters, whiсh were written before moira 2.2 #139
* Update golang to version 1.11.2 #147
* Flush trigger events when removing the trigger #116
* Remove redundant Graphite-metrics that counted the time of check of each single trigger #117
* Add api method GET trigger/search to implement full-text trigger search in api, GET trigger/page is deprecated now #125
* Update Moira Client 2.4
* Update Moira Trigger Role 2.4

### Fixed

* Redis leakages: some data was not removed properly from Redis storage #129
* Bug in trigger schedule due to which triggers were considered suppressed between 23:59:00 and 00:00:59 #127
* Bug in trigger when specific schedule time didn't work if start time was bigger than end time #119
* Bug in Create and test button when add new subscription moira-alert/web2.0#194
* Bug that increases updated last checks count when user create or update trigger from api (or web) #146
* Bug which allowed to use other people's contacts your in subscriptions #145
* Bug that allowed to create and use an empty tag in subscriptions and triggers #144
* Bug when senders didn't resolve EXCEPTION state #156


## [2.3.1] - 2018-27-08

### Fixed

* `last_remote_check_delay` option in Notifier config file #114

## [2.3] - 2018-20-08

### Added

* Add API methods: DELETE /notification/all and DELETE /event/all #73.
* Add notifier config option: DateTime format for email sender #74.
* Add Graphite-API support for remote triggers #75.
* Add option to enable runtime metrics in Graphite-section of configuration #79.
* Add new fancy email template 🎂 #82.
* Change default trigger state to TTLState option instead of NODATA #83.
* Refactor maintenance logic #87. See more: Maintenance.
* Add basic false NODATA protection #90. See more: Self State Monitor.
* Prohibit removal of contact with assigned subscriptions found #91.
* Make trigger exception messages more descriptive #92.
* Make filter cache capacity configurable #93. See more Filter Configuration.
* Remove deprecated pseudo-tags, use checkboxes instead #95. See more: Ignore specific states transitions.
* Allow to use single-valued thresholds (ex. only WARN or only ERROR) #96.
* Reduce the useless CPU usage in Moira-Filter #98. Thanks to @errx.
* Add concurrent matching workers in Moira-Filter #99. Thanks to @errx.
* Update Carbonapi to 1.0.0-rc.0 #101.
* Improve checker performance #103.
* Add Markdown support in contact edit modal view moira-alert/web2.0#138.
* Add ability to type negative numbers in simple trigger edit mode moira-alert/web2.0#169.
* Update Moira Client 2.3.4.
* Update Moira Trigger Role 2.3.

### Fixed

* Newlines in trigger description body for web and email sender #76.
* Incorrect behavior in which the trigger did not return from the EXCEPTION state #94.
* Default timezone in trigger moira-alert/web2.0#173.
* Trailing whitespaces in tag search bar moira-alert/web2.0#139.

## [2.2] - 2018-03-14

### Added

* Add domain autoresolving for self-metrics sending to Graphite.
* Translate pagination.
* Hide tag list on trigger edit page.
* Highlight metric row on mouse hover.
* Re-enable Markdown in Slack sender.
* Optimize reading metrics while checking trigger (removed unnecessary Redis transaction).
* Replace pseudotags with ordinary checkboxes in Web UI (but not on backend yet).
* Update event names in case trigger name had changed.
* Make sorting by status the default option on trigger page.
* Automatically add tags from search bar when creating new trigger.
* Sort tags alphabetically everywhere.
* Update carbonapi (new functions: map, reduce, delay; updated: asPercent).
* Add metrics for each trigger handling time.
* Add Redis Sentinel support.
* Increase trigger processing speed by adding a cache on metric patterns.
* Add metric name to "Trigger has same timeseries names" error message.
* Optimize internal metric collection.

### Fixed

* Bug in triggers with multiple targets. Metrics from targets T2, T3, ... were not deleted properly.
* Bug that allowed to create pseudotags (ERROR, etc.) as ordinary tags.
* Old-style configuration files in platform-specific packages.
* Bug that prevented non-integer timestamps from processing.
* Logo image background.
* Sorting on -s and 0s.
* UI glitch while setting maintenance time.
* Concurrent read/write from expression cache.
* Retention scheme parsing for some rare cases with comments.

## [2.1] - 2018-01-12

### Added

* Throw an exception if any target except the first one resolves in more than one metric.
* User login information to API request logs.

### Fixed

* Moira version detection in CI builds.
* Long interval between creating a new trigger and getting data into that trigger.

## [2.0] - 2017-12-13

### Added

All new Moira written in Go

## [2.0-beta3] - 2017-11-28

### Fixed

* Performance-related bug in filter (memory leak under high load)
* Graphite expression parsing bug that sometimes prevented saving triggers

## [2.0-beta2] - 2017-11-09

### Fixed

* RPM and DEB package conflicts due to storage-schemas.conf
