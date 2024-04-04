import { SafeHtml } from '@angular/platform-browser';

export interface ILoginParams{
    username: string,
    password: string
}

export interface IRegisterParams{
    firstName: string,
    // lastName: string,
    email: string,
    phoneEnabled: boolean,
    phoneNumber: string,
    password: string,
    confirmPassword: string
}

export interface ILoginParams{
    username: string;
    password: string;
    externalAuth?: {
        accessToken: string,
        id: string
    };
}

export interface IForgotPasswordParams{
    email: string
}

export interface IChangePasswordParams{
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
}

export interface ICustomer {
    id?;
    customerGuid: string
    email: string
    isGuest: boolean
    isVendor: boolean
    isAdmin: boolean
    customerRoles: Array<ICustomerRole>
    firstName: string
    lastName: string
    fullName: string
    phone: string
}

export interface IProfile{
    email: string,
    firstName: string,
    // lastName: string,
    phone: string
}

export interface ICustomerRole {
    id
    systemName: CustomerRoleSystemName
}

export interface ICustomerOrder{
    orderId: number,
    orderItemId: number,
    productId: number,
    productName: string,
    contractStart: string,
    contractEnd: string,
    rentalInfo: string,
    pictureThumbnailUrl: string,
    safePictureThumbnailUrl: SafeHtml,
    orderStatusId: number,
    orderStatus: string,
    buildingName: string,
    propertyNumber: string,
    buildingNamePicture: string,
    propertyNumberPicture: string,
    statusCssClass: string,
    statusText: string,
    isRental: boolean
}

export interface INotification{
    title: string,
    date: string,
    note: string
}

export interface ICustomerOrderDetails{
    orderId: number,
    productId: number,
    productName: string,
    vendorId: number,
    orderStatus: number,
    orderStatusText: string,
    orderStatusCssClass: string,
    buildingName: string,
    propertyNumber: string,
    buildingNamePicture: string,
    propertyNumberPicture: string,
    contractStart: string,
    contractEnd: string,
    duration: string,
    paymentMethod: string,
    paymentMethodStatus: string,
    orderSubtotal: string,
    orderTotal: string,
    unitPrice: string,
    productPictures: Array<string>,
    safePictureUrls: Array<string>,
    isRental: boolean,
    contractPayments: Array<IPayment>,
    maintenanceHistory: Array<IMaintenance>
}

// export interface OrderRentalPeriod{
//     OrderId: number,
//     Note: string,
//     CreatedOnUtc: Date,
//     PaymentMethod: string,
//     PeriodDate: Date,
//     Amount: number,
//     PaidDate: Date,
//     ChequeNumber: string,
//     PeriodStatusId: number,
//     AttachmentId: number
// }

export interface IPayment{
    date: Date,
    shortDate: string,
    statusId: number,
    amount: string,
    paymentMethod: string,
    chequeNumber: string,
    cssClass: string
}

export interface IMaintenance{
    id: number,
    title: string,
    date: string,
    amount: string,
    statusId: number,
    status: string,
    cssClass: string
}

export interface IMaintenanceType{
    text: string,
    value: string
}

export interface IMaintenanceParams{
    orderId: number,
    vendorId: number,
    expenseCategory: number,
    notes: string
}

export enum CustomerRoleSystemName {
    Guests = "Guests",
    Administrators = "Administrators",
    Registered = "Registered",
    Vendors = "Vendors"
}

export enum LoginType {
    STANDARD = 10,
    FACEBOOK = 20,
}

export enum OrderStatus
{
    Pending = 10,
    Processing = 20,
    Started = 30,
    Cancelled = 40,
    Complete = 50
}

export enum PaymentStatus
{
    Pending = 10,
    Authorized = 20,
    Paid = 30,
    PartiallyRefunded = 35,
    Refunded = 40,
    Voided = 50
}

export enum MaintenanceStatus{
    Pending = 10,
    Completed = 20,
    Processing = 30,
    Rejected = 40,
}

export enum ExpenseType
{
    General = 10,
    Contract = 20,
    Property = 30
}