import { ITab } from "./interfaces";

export interface ICommonPageLayoutProps {
    pageHeader: React.ReactNode;
    pageBody: React.ReactNode;
}

export interface ICommonDialogProps {
    open: boolean;
    onClose: () => void;
    header: React.ReactNode;
    body: React.ReactNode;
    position?: string;
    footer?: React.ReactNode;
}

export interface ITabNavigatorProps {
  tabData: ITab[];
  activeTab: string;
  fromPage: string;
  routing?: boolean;
  selectedTab?: ITab;
  setSelectedTab?: Function;
}