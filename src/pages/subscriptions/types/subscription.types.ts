export interface Subscription {
    id?: string,
    customerEmail: string,
    customerId: string,
    endpoint?: string,
    keys?: {
        p256dh: string,
        auth: string
    }
}