export interface Property {
    id: string;
    name: string;
}

export interface Gate {
    id: string;
    name: string;
}

export interface HostUser {
    user: {
        id: string;
        name: string;
    };
}

export interface Visitor {
    id: string;

    visitorName: string;
    visitorPhone: string;

    purpose: string;

    status: "PENDING" | "CHECKED_IN" | "CHECKED_OUT";

    createdAt: string;

    checkInTime: string | null;
    checkOutTime: string | null;

    gate?: {
        id: string;
        name: string;
    };

    hostUser?: {
        id: string;
        name: string;
    };
}