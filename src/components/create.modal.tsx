'use client';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from "swr";
import '@/styles/create_modal.module.css';



interface Iprops {
    showModalCreate: boolean;
    setShowModalCreate: (value: boolean) => void;
    selectedUser?: IUser | null;
}

function CreateModal(props: Iprops) {
    const { showModalCreate, setShowModalCreate, selectedUser } = props;

    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() => {
        if (showModalCreate && selectedUser) {
            setEmail(selectedUser.email);
            setName(selectedUser.name);
            setRole(selectedUser.role);
            setPassword("");
            setConfirmPassword("");
        } else {
            setEmail("");
            setName("");
            setRole("");
            setPassword("");
            setConfirmPassword("");
        }
    }, [showModalCreate, selectedUser]);

    const handleSubmitForm = async () => {
        if (!email) {
            toast.error("Email cannot be empty!");
            return;
        }
        if (!name) {
            toast.error("Name cannot be empty!");
            return;
        }
        if (!role) {
            toast.error("Role cannot be empty!");
            return;
        }
        if (!selectedUser && !password) {
            toast.error("Password cannot be empty!");
            return;
        }
        if (!selectedUser && password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        const method = selectedUser ? 'PUT' : 'POST';
        const url = selectedUser
            ? `http://localhost:8000/users/${selectedUser.id}`
            : 'http://localhost:8000/users';

        const userData: Partial<IUser> = {
            name,
            email,
            role,
            ...(selectedUser ? {} : { password }) // password only when creating new user with admin
        };

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            const res = await response.json();

            if (res) {
                toast.success(selectedUser ? "Update user succeeded" : "Create new user succeeded");
                handleCloseModal();
                mutate("http://localhost:8000/users");
            } else {
                toast.error(selectedUser ? "Update error user" : "Create error new user");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("An error occurred while saving the user");
        }
    }

    const handleCloseModal = () => {
        setName("");
        setEmail("");
        setRole("");
        setPassword("");
        setConfirmPassword("");
        setShowModalCreate(false);
    }

    return (
        <>
            <Modal
                show={showModalCreate}
                onHide={() => handleCloseModal()}
                backdrop="static"
                keyboard={false}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{selectedUser ? "Edit User" : "Add New User"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={!!selectedUser}
                                className="inputField"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="inputField"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className="inputField"
                            >
                                <option value="ADMIN">ADMIN</option>
                                <option value="USER">USER</option>
                            </Form.Select>
                        </Form.Group>
                        {!selectedUser && (
                            <>
                                <Form.Group className="mb-3">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(event) => setPassword(event.target.value)}
                                        className="inputField"
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Confirm password"
                                        value={confirmPassword}
                                        onChange={(event) => setConfirmPassword(event.target.value)}
                                        className="inputField"
                                    />
                                </Form.Group>
                            </>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModal()}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitForm()}>
                        {selectedUser ? "Update" : "Save"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default CreateModal;
