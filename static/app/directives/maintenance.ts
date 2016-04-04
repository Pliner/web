import {Api} from '../services/api';
import {MetricCheck} from '../models/trigger';
import * as moment from 'moment';

declare function require(string): any;

export interface IMaintenanceScope extends ng.IScope {
	check: MetricCheck;
	triggerid: string;
	set_metric_maintenance(time: number, $event: ng.IAngularEvent);
	menu($event: ng.IAngularEvent);
	show: boolean;
	now: number;
}

export function Maintenance($timeout: ng.ITimeoutService, $document: ng.IDocumentService, api: Api): ng.IDirective {
	return {
		restrict: 'E',
		transclude: true,
		scope: {
			check: "=check",
			triggerid: "@"
		},
		template: require("./templates/maintenance.html"),
		replace: true,
		link: (scope: IMaintenanceScope) => {
			scope.now = moment.utc().unix();
			scope.show = false;
			scope.set_metric_maintenance = (time: number, $event: ng.IAngularEvent) => {
				var data = {};
				data[scope.check.metric] = time;
				if (time > 0) {
					data[scope.check.metric] = moment.utc().add(time, "minutes").unix();
				}
				api.trigger.maintenance(scope.triggerid, data).then(() => {
					scope.check.json.maintenance = data[scope.check.metric];
				});
				scope.show = false;
				$event.stopPropagation();
			};
			scope.menu = ($event: ng.IAngularEvent) => {
				scope.show = !scope.show;
				$event.stopPropagation();
			};
			$document.bind('click', (event) => {
				$timeout(() => {
					scope.show = false;
				});
			});
		}
	};
}

Maintenance.$inject = ['$timeout', '$document','api'];