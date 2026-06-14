import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Gate, HostUser, Property, Visitor } from '@/interfaces/visitor';
import apiPrivate from '@/lib/api';
import { useEffect, useState } from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Visitorpage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [selectedProperty, setSelectedProperty] = useState("");

    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [gates, setGates] = useState<Gate[]>([]);
    const [users, setUsers] = useState<HostUser[]>([]);

    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        visitorName: "",
        visitorPhone: "",
        purpose: "",

        gateId: "",
        hostUserId: "",

        vehicleNumber: "",
        vehicleType: "",

        remarks: "",
    });

    const fetchProperties = async () => {
        const res = await apiPrivate.get("/properties");

        setProperties(res.data.data);

        if (res.data.data.length > 0) {
            setSelectedProperty(res.data.data[0].id);
        }
    };

    const fetchVisitors = async (propertyId: string) => {
        const res = await apiPrivate.get(
            `/properties/${propertyId}/visitors`
        );

        setVisitors(res.data.data);
    };

    const fetchGates = async (propertyId: string) => {
        const res = await apiPrivate.get(
            `/properties/${propertyId}/gates`
        );

        setGates(res.data.data);
    };

    const fetchUsers = async (propertyId: string) => {
        const res = await apiPrivate.get(
            `/properties/${propertyId}/users`
        );

        setUsers(res.data.data);
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    useEffect(() => {
        if (!selectedProperty) return;

        fetchVisitors(selectedProperty);
        fetchGates(selectedProperty);
        fetchUsers(selectedProperty);
    }, [selectedProperty]);

    const handleCreateVisitor = async () => {
        try {
            setSubmitting(true);

            await apiPrivate.post(
                `/properties/${selectedProperty}/visitors`,
                formData
            );

            await fetchVisitors(selectedProperty);

            setOpen(false);

            setFormData({
                visitorName: "",
                visitorPhone: "",
                purpose: "",

                gateId: "",
                hostUserId: "",

                vehicleNumber: "",
                vehicleType: "",

                remarks: "",
            });
        } finally {
            setSubmitting(false);
        }
    };

    const approveVisitor = async (
        visitorId: string
    ) => {
        await apiPrivate.patch(
            `/properties/${selectedProperty}/visitors/${visitorId}/approve`
        );

        fetchVisitors(selectedProperty);
    };

    const checkoutVisitor = async (
        visitorId: string
    ) => {
        await apiPrivate.patch(
            `/properties/${selectedProperty}/visitors/${visitorId}/checkout`
        );

        fetchVisitors(selectedProperty);
    };
    return (
        <div>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h1 className="text-2xl font-bold">
                    Visitors
                </h1>

                <div className="flex gap-2">
                    <Select
                        value={selectedProperty}
                        onValueChange={setSelectedProperty}
                    >
                        <SelectTrigger className="w-[220px]">
                            <SelectValue placeholder="Select Property" />
                        </SelectTrigger>

                        <SelectContent>
                            {properties.map((property) => (
                                <SelectItem
                                    key={property.id}
                                    value={property.id}
                                >
                                    {property.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                Add Visitor
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Add Visitor
                                </DialogTitle>
                            </DialogHeader>

                            <div className="space-y-4">
                                {/* Visitor Name */}

                                <div>
                                    <Label>Visitor Name</Label>

                                    <Input
                                        value={formData.visitorName}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                visitorName: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter visitor name"
                                    />
                                </div>

                                {/* Visitor Phone */}

                                <div>
                                    <Label>Visitor Phone</Label>

                                    <Input
                                        value={formData.visitorPhone}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                visitorPhone: e.target.value,
                                            }))
                                        }
                                        placeholder="Enter phone number"
                                    />
                                </div>

                                {/* Purpose */}

                                <div>
                                    <Label>Purpose</Label>

                                    <Input
                                        value={formData.purpose}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                purpose: e.target.value,
                                            }))
                                        }
                                        placeholder="Meeting / Delivery / Maintenance"
                                    />
                                </div>

                                {/* Gate */}

                                <div>
                                    <Label>Gate</Label>

                                    <Select
                                        value={formData.gateId}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                gateId: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gate" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {gates.map((gate) => (
                                                <SelectItem
                                                    key={gate.id}
                                                    value={gate.id}
                                                >
                                                    {gate.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Host User */}

                                <div>
                                    <Label>Host User</Label>

                                    <Select
                                        value={formData.hostUserId}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                hostUserId: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Host" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            {users.map((user) => (
                                                <SelectItem
                                                    key={user.user.id}
                                                    value={user.user.id}
                                                >
                                                    {user.user.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Vehicle Number */}

                                <div>
                                    <Label>Vehicle Number</Label>

                                    <Input
                                        value={formData.vehicleNumber}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                vehicleNumber: e.target.value,
                                            }))
                                        }
                                        placeholder="KA01AB1234"
                                    />
                                </div>

                                {/* Vehicle Type */}

                                <div>
                                    <Label>Vehicle Type</Label>

                                    <Select
                                        value={formData.vehicleType}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                vehicleType: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Vehicle Type" />
                                        </SelectTrigger>

                                        <SelectContent>
                                            <SelectItem value="BIKE">
                                                Bike
                                            </SelectItem>

                                            <SelectItem value="CAR">
                                                Car
                                            </SelectItem>

                                            <SelectItem value="AUTO">
                                                Auto
                                            </SelectItem>

                                            <SelectItem value="TRUCK">
                                                Truck
                                            </SelectItem>

                                            <SelectItem value="OTHER">
                                                Other
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Remarks */}

                                <div>
                                    <Label>Remarks</Label>

                                    <Input
                                        value={formData.remarks}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                remarks: e.target.value,
                                            }))
                                        }
                                        placeholder="Optional remarks"
                                    />
                                </div>

                                {/* Submit */}

                                <Button
                                    className="w-full"
                                    disabled={submitting}
                                    onClick={handleCreateVisitor}
                                >
                                    {submitting
                                        ? "Creating..."
                                        : "Add Visitor"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Visitor</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Gate</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {visitors.map((visitor) => (
                        <TableRow key={visitor.id}>
                            <TableCell>
                                {new Date(
                                    visitor.createdAt
                                ).toLocaleDateString()}
                            </TableCell>

                            <TableCell>
                                {visitor.visitorName}
                            </TableCell>

                            <TableCell>
                                {visitor.visitorPhone}
                            </TableCell>

                            <TableCell>
                                {visitor.gate?.name ?? "-"}
                            </TableCell>

                            <TableCell>
                                {visitor.hostUser?.name ?? "-"}
                            </TableCell>

                            <TableCell>
                                {visitor.status}
                            </TableCell>

                            <TableCell>
                                {visitor.checkInTime
                                    ? new Date(
                                        visitor.checkInTime
                                    ).toLocaleString()
                                    : "-"}
                            </TableCell>

                            <TableCell>
                                {visitor.checkOutTime
                                    ? new Date(
                                        visitor.checkOutTime
                                    ).toLocaleString()
                                    : "-"}
                            </TableCell>

                            <TableCell>
                                <div className="flex gap-2">
                                    {visitor.status ===
                                        "PENDING" && (
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    approveVisitor(
                                                        visitor.id
                                                    )
                                                }
                                            >
                                                Approve
                                            </Button>
                                        )}

                                    {visitor.status ===
                                        "CHECKED_IN" && (
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                onClick={() =>
                                                    checkoutVisitor(
                                                        visitor.id
                                                    )
                                                }
                                            >
                                                Checkout
                                            </Button>
                                        )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
