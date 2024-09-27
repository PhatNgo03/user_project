import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { mutate } from "swr"
import '@/styles/create_modal.module.css'


interface Iprops {
    showModalCreate: boolean;
    setShowModalCreate: (value: boolean) => void;
    selectedUser?: IUser | null;
}

function CreateModal(props: Iprops) {
    const { showModalCreate, setShowModalCreate, selectedUser } = props;

    // Các state cho form
    const [email, setEmail] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [role, setRole] = useState<string>("");

    useEffect(() => {
        if (showModalCreate && selectedUser) {
            setEmail(selectedUser.email);
            setName(selectedUser.name);
            setRole(selectedUser.role);
        } else {
            setEmail("");
            setName("");
            setRole("");
        }
    }, [showModalCreate, selectedUser]);

    const handleSubmitForm = () => {
        if (!email) {
            toast.error("Title is not empty!");
            return;
        }
        if (!name) {
            toast.error("Author is not empty!");
            return;
        }
        if (!role) {
            toast.error("Content is not empty!");
            return;
        }

        // Kiểm tra nếu đang chỉnh sửa hay tạo mới
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
            body: JSON.stringify({ name, email, role })
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
        setShowModalCreate(false)
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
                    <Modal.Title>{selectedUser ? "Edit user" : "Add new a user"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" >
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="......."
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={!!selectedUser}
                                className="inputField"
                            />

                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="......."
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                className="inputField" // Assign a class
                            />

                        </Form.Group>
                        <Form.Group className="mb-3" >
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                                className="textAreaField" // Assign a class
                            />
                        </Form.Group>
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
