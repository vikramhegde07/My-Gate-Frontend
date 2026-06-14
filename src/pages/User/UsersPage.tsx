import { useEffect, useState } from "react";

import apiPrivate from "@/lib/api";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Property {
    id: string;
    name: string;
    type: string;
}

interface PropertyUser {
    role: string;
    designation: string | null;

    user: {
        id: string;
        name: string;
        email: string | null;
        phone: string | null;
        isActive: boolean;
    };
}

export default function UsersPage() {
    const [properties, setProperties] = useState<Property[]>([]);

    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [users, setUsers] = useState<PropertyUser[]>([]);

    const [loadingProperties, setLoadingProperties] =
        useState(true);

    const [loadingUsers, setLoadingUsers] =
        useState(false);

    const [open, setOpen] = useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",

        role: "SECURITY",
        designation: "",
    });

    /* ==========================================
       FETCH PROPERTIES
    ========================================== */

    const fetchProperties = async () => {
        try {
            const res =
                await apiPrivate.get("/properties");

            setProperties(res.data.data);

            if (
                res.data.data.length > 0 &&
                !selectedProperty
            ) {
                setSelectedProperty(
                    res.data.data[0]
                );
            }
        } finally {
            setLoadingProperties(false);
        }
    };

    /* ==========================================
       FETCH USERS
    ========================================== */

    const fetchUsers = async (
        propertyId: string
    ) => {
        try {
            setLoadingUsers(true);

            const res =
                await apiPrivate.get(
                    `/properties/${propertyId}/users`
                );

            setUsers(res.data.data);
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (selectedProperty) {
            fetchUsers(
                selectedProperty.id
            );
        }
    }, [selectedProperty]);

    /* ==========================================
       CREATE USER
    ========================================== */

    const handleCreateUser =
        async () => {
            if (!selectedProperty)
                return;

            try {
                setSubmitting(true);

                await apiPrivate.post(
                    `/properties/${selectedProperty.id}/users`,
                    formData
                );

                await fetchUsers(
                    selectedProperty.id
                );

                setOpen(false);

                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    password: "",

                    role: "SECURITY",
                    designation: "",
                });
            } finally {
                setSubmitting(false);
            }
        };

    return (
        <div className="space-y-6">
            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold">
                    Users
                </h1>

                <p className="text-muted-foreground">
                    Manage property users
                    and staff
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* LEFT PANEL */}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Properties
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        {loadingProperties ? (
                            <p>
                                Loading...
                            </p>
                        ) : (
                            <div className="space-y-2">
                                {properties.map(
                                    (
                                        property
                                    ) => (
                                        <button
                                            key={
                                                property.id
                                            }
                                            onClick={() =>
                                                setSelectedProperty(
                                                    property
                                                )
                                            }
                                            className={`w-full rounded-lg border p-3 text-left transition ${selectedProperty?.id ===
                                                    property.id
                                                    ? "border-primary bg-primary/5"
                                                    : "hover:bg-muted"
                                                }`}
                                        >
                                            <p className="font-medium">
                                                {
                                                    property.name
                                                }
                                            </p>

                                            <p className="text-xs text-muted-foreground">
                                                {
                                                    property.type
                                                }
                                            </p>
                                        </button>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* RIGHT PANEL */}

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {selectedProperty
                                ? `${selectedProperty.name} Users`
                                : "Select Property"}
                        </CardTitle>

                        {selectedProperty && (
                            <Dialog
                                open={open}
                                onOpenChange={
                                    setOpen
                                }
                            >
                                <DialogTrigger
                                    asChild
                                >
                                    <Button>
                                        Add User
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Add User
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <Label>
                                                Name
                                            </Label>

                                            <Input
                                                value={
                                                    formData.name
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            name: e
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>
                                                Email
                                            </Label>

                                            <Input
                                                value={
                                                    formData.email
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            email:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>
                                                Phone
                                            </Label>

                                            <Input
                                                value={
                                                    formData.phone
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            phone:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>
                                                Password
                                            </Label>

                                            <Input
                                                type="password"
                                                value={
                                                    formData.password
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            password:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>
                                                Role
                                            </Label>

                                            <Select
                                                value={
                                                    formData.role
                                                }
                                                onValueChange={(
                                                    value
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            role: value,
                                                        })
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>

                                                <SelectContent>
                                                    <SelectItem value="SECURITY">
                                                        Security
                                                    </SelectItem>

                                                    <SelectItem value="STAFF">
                                                        Staff
                                                    </SelectItem>

                                                    <SelectItem value="COMMITTEE">
                                                        Committee
                                                    </SelectItem>

                                                    <SelectItem value="RESIDENT">
                                                        Resident
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label>
                                                Designation
                                            </Label>

                                            <Input
                                                value={
                                                    formData.designation
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            designation:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                                placeholder="Day Security"
                                            />
                                        </div>

                                        <Button
                                            className="w-full"
                                            disabled={
                                                submitting
                                            }
                                            onClick={
                                                handleCreateUser
                                            }
                                        >
                                            {submitting
                                                ? "Creating..."
                                                : "Add User"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardHeader>

                    <CardContent>
                        {!selectedProperty ? (
                            <p>
                                Select a
                                property.
                            </p>
                        ) : loadingUsers ? (
                            <p>
                                Loading
                                users...
                            </p>
                        ) : users.length ===
                            0 ? (
                            <p className="text-muted-foreground">
                                No users
                                found.
                            </p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {users.map(
                                    (
                                        propertyUser
                                    ) => (
                                        <Card
                                            key={
                                                propertyUser
                                                    .user
                                                    .id
                                            }
                                        >
                                            <CardHeader>
                                                <CardTitle>
                                                    {
                                                        propertyUser
                                                            .user
                                                            .name
                                                    }
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="space-y-2 text-sm">
                                                <p>
                                                    {
                                                        propertyUser.role
                                                    }
                                                </p>

                                                {propertyUser.designation && (
                                                    <p className="text-muted-foreground">
                                                        {
                                                            propertyUser.designation
                                                        }
                                                    </p>
                                                )}

                                                <p className="text-muted-foreground">
                                                    {
                                                        propertyUser
                                                            .user
                                                            .email
                                                    }
                                                </p>

                                                <p className="text-muted-foreground">
                                                    {
                                                        propertyUser
                                                            .user
                                                            .phone
                                                    }
                                                </p>
                                            </CardContent>
                                        </Card>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}