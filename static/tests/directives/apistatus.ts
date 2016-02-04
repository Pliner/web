import {IApiStatusScope} from '../../app/directives/apistatus';
import {Api} from '../../app/services/api';

describe("directive: api-status", () => {
    var element: ng.IAugmentedJQuery;
    var scope:IApiStatusScope;
    var $httpBackend;

    beforeEach(angular.mock.module('moira'));
    beforeEach(angular.mock.inject(function(_$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectGET("config.json").respond(() => {
            return [500, "Bad news", {}];
        });
    }));

    beforeEach(angular.mock.inject(function($rootScope: ng.IRootScopeService, $compile: ng.ICompileService) {
        scope = <IApiStatusScope>$rootScope.$new();
        element = $compile('<moira-api-status></moira-api-status>')(scope);
        scope.$digest();
    }));

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("http service returns error", () => {
        beforeEach(() => {
            $httpBackend.flush();
        });
        it("api status has error", () => {
            expect(scope.api_status.response_error).toBe("Bad news");
        });
    });

});