import { environment } from '../../../environments/environment';

export class AppConstant {
  public static readonly DEBUG = !environment.production;

  public static readonly BASE_URL = !environment.production
    ? 'http://localhost:8081/api/'
    : 'http://www.choisy.com/api/';

  public static readonly BASE_API_URL = `${AppConstant.BASE_URL}`;
  public static readonly DB_NAME = 'choisy';
  public static readonly GOOGLE_MAP_API_KEY =
    'AIzaSyD0y6Q6UmumKiMplydd-jynVkXkeOFH7WY';

  // public static readonly DEFAULT_DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
  public static readonly DATETIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';
  public static readonly DATE_FORMAT = 'yyyy-MM-dd';
  public static readonly TIME_FORMAT = 'HH:mm';
  public static readonly TIME_FORMAT_AMPM = 'hh:mm a';
  public static readonly PAGE_SIZE = 15;

  public static readonly EVENT_DB_INITIALIZED = 'event:dbInitialized';
  public static readonly EVENT_LANGUAGE_CHANGED = 'event:languageChanged';
  public static readonly EVENT_NAVIGATE_TO = 'event:navigateTo';

  public static readonly KEY_WORKING_LANGUAGE = 'key:workingLanguage';
  public static readonly KEY_APP_TOUR = 'key:appTour';
}
