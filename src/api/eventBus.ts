class EventBus extends EventTarget {
}

export const eventBus = new EventBus();

export enum EventName {
    GamesUpdated= 'GamesUpdated',
    DropDownDataUpdated = 'DropDownDataUpdated',
    SettingsUpdated = 'SettingsUpdated',
    UsersUpdated = 'UsersUpdated',
    SortingReset = 'SortingReset',
}