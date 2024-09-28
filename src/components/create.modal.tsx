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

    // State for form
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
            setPassword(""); // Clear password and confirm password fields when editing
            setConfirmPassword("");
        } else {
            setEmail("");
            setName("");
            setRole("");
            setPassword(""); // Clear fields for new user
            setConfirmPassword("");
        }
    }, [showModalCreate, selectedUser]);

    const handleSubmitForm = () => {
        if (!email) {
            toast.error("Email is not empty!");
            return;
        }
        if (!name) {
            toast.error("Name is not empty!");
            return;
        }
        if (!role) {
            toast.error("Role is not empty!");
            return;
        }
        if (!selectedUser && !password) {
            toast.error("Password is not empty!");
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        // Determine the method and URL based on whether we are editing or creating
        const method = selectedUser ? 'PUT' : 'POST';
        const url = selectedUser
            ? `http://localhost:8000/users/${selectedUser.id}`
            : 'http://localhost:8000/users';

        fetch(url, {
            method: method,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, role, ...(selectedUser ? {} : { password }) })
        }).then(res => res.json())
            .then(res => {
                if (res) {
                    toast.success(selectedUser ? "Update user succeed" : "Create new user succeed");
                    handleCloseModal();
                    mutate("http://localhost:8000/users");
                } else {
                    toast.error(selectedUser ? "Update error user" : "Create error new user");
                }
            });
    }

    const handleCloseModal = () => {
        setName("");
        setEmail("");
        setRole("");
        setPassword(""); // Reset password field
        setConfirmPassword(""); // Reset confirm password field
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
                    <Modal.Title>{selectedUser ? "Edit user" : "Add new user"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
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
                            <Form.Control
                                placeholder="Enter role"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className="inputField"
                            />
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
