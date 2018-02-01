import { LoadingMaskGroup } from './model/mask';
import { LoadingEvent } from './model/event';
import { Observable } from 'rxjs/Observable';
import { Config } from './model/config';
export declare class LoadingMaskService {
    private config;
    private isSnipPreload;
    private uuid;
    private maskGroupMap;
    private loadingEvent$;
    constructor(config: Config);
    subscribe(groupName?: string): Observable<LoadingEvent>;
    register(groupName?: string, replace?: boolean): LoadingMaskGroup;
    unregister(groupName: string): void;
    isDefaultGroup(groupName: string): boolean;
    isDoneGroup(group: LoadingMaskGroup): boolean;
    getGroup(groupName: string, safe?: boolean): LoadingMaskGroup;
    setGroup(groupName: string, replace?: boolean): LoadingMaskGroup;
    showGroup(groupName?: string): void;
    hideGroup(groupName?: string): void;
    hideGroupError(groupName: string, error: any): void;
    preloadImage(): void;
    private bootstrap();
    private loadingEventFactory(groupName, status, data?);
    private maskGroupFactory(groupName);
}
