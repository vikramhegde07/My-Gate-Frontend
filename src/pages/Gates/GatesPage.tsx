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

interface Property {
    id: string;
    name: string;
    code: string;
    type: string;
}

interface Gate {
    id: string;
    name: string;
    code?: string;
    description?: string;
}

export default function GatesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] =
        useState<Property | null>(null);

    const [gates, setGates] = useState<Gate[]>([]);

    const [loadingProperties, setLoadingProperties] =
        useState(true);

    const [loadingGates, setLoadingGates] =
        useState(false);

    const [open, setOpen] = useState(false);

    const [submitting, setSubmitting] =
        useState(false);

    const [formData, setFormData] = useState({
        name: "",
        code: "",
        description: "",
    });

    /* =====================================================
       FETCH PROPERTIES
    ===================================================== */

    const fetchProperties = async () => {
        try {
            const res =
                await apiPrivate.get("/properties");

            const propertiesData =
                res.data.data;

            setProperties(propertiesData);

            if (
                propertiesData.length > 0 &&
                !selectedProperty
            ) {
                setSelectedProperty(
                    propertiesData[0]
                );
            }
        } finally {
            setLoadingProperties(false);
        }
    };

    /* =====================================================
       FETCH GATES
    ===================================================== */

    const fetchGates = async (
        propertyId: string
    ) => {
        try {
            setLoadingGates(true);

            const res =
                await apiPrivate.get(
                    `/properties/${propertyId}/gates`
                );

            setGates(res.data.data);
        } finally {
            setLoadingGates(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (selectedProperty) {
            fetchGates(
                selectedProperty.id
            );
        }
    }, [selectedProperty]);

    /* =====================================================
       CREATE GATE
    ===================================================== */

    const handleCreateGate =
        async () => {
            if (!selectedProperty)
                return;

            try {
                setSubmitting(true);

                await apiPrivate.post(
                    `/properties/${selectedProperty.id}/gates`,
                    formData
                );

                await fetchGates(
                    selectedProperty.id
                );

                setOpen(false);

                setFormData({
                    name: "",
                    code: "",
                    description: "",
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
                    Gates
                </h1>

                <p className="text-muted-foreground">
                    Manage gates for your
                    properties
                </p>
            </div>

            {/* MAIN LAYOUT */}

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
                        ) : properties.length ===
                            0 ? (
                            <p className="text-sm text-muted-foreground">
                                No properties
                                found.
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
                                ? `${selectedProperty.name} Gates`
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
                                    <Button
                                        disabled={
                                            gates.length >=
                                            3
                                        }
                                    >
                                        Create Gate
                                    </Button>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Create
                                            Gate
                                        </DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-4">
                                        <div>
                                            <Label>
                                                Gate
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
                                                Gate
                                                Code
                                            </Label>

                                            <Input
                                                value={
                                                    formData.code
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            code: e
                                                                .target
                                                                .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <div>
                                            <Label>
                                                Description
                                            </Label>

                                            <Input
                                                value={
                                                    formData.description
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    setFormData(
                                                        (
                                                            prev
                                                        ) => ({
                                                            ...prev,
                                                            description:
                                                                e
                                                                    .target
                                                                    .value,
                                                        })
                                                    )
                                                }
                                            />
                                        </div>

                                        <Button
                                            className="w-full"
                                            disabled={
                                                submitting
                                            }
                                            onClick={
                                                handleCreateGate
                                            }
                                        >
                                            {submitting
                                                ? "Creating..."
                                                : "Create Gate"}
                                        </Button>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        )}
                    </CardHeader>

                    <CardContent>
                        {!selectedProperty ? (
                            <p className="text-muted-foreground">
                                Select a
                                property to
                                view gates.
                            </p>
                        ) : loadingGates ? (
                            <p>
                                Loading
                                gates...
                            </p>
                        ) : gates.length ===
                            0 ? (
                            <p className="text-muted-foreground">
                                No gates
                                found.
                            </p>
                        ) : (
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {gates.map(
                                    (
                                        gate
                                    ) => (
                                        <Card
                                            key={
                                                gate.id
                                            }
                                        >
                                            <CardHeader>
                                                <CardTitle className="text-lg">
                                                    {
                                                        gate.name
                                                    }
                                                </CardTitle>
                                            </CardHeader>

                                            <CardContent className="space-y-2">
                                                {gate.code && (
                                                    <p className="text-sm text-muted-foreground">
                                                        Code:{" "}
                                                        {
                                                            gate.code
                                                        }
                                                    </p>
                                                )}

                                                {gate.description && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            gate.description
                                                        }
                                                    </p>
                                                )}
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