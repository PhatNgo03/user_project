'use client'
import Table from 'react-bootstrap/Table';
import { Button } from 'react-bootstrap';
import CreateModal from './create.modal';
import { useState } from 'react';
import Link from 'next/link';
import { title } from 'process';
import { toast } from 'react-toastify';
import { mutate } from 'swr';


interface IProps {
    users: IUser[]
}

const AppTable = (props: IProps) => {

    const { users } = props;
    const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
    const [selectedUser, setselectedUser] = useState<IUser | null>(null);

    const handleEditUser = (user: IUser) => {
        setselectedUser(user);
        setShowModalCreate(true);
    };

    const handleDeleteUser = (id: number) => {
        if (confirm(`Do you want to delete this user ${title}`)) {
            fetch(`http://localhost:8000/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
            }).then(res => res.json())
                .then(res => {
                    if (res) {
                        toast.success("Delete user succeed");
                        mutate("http://localhost:8000/users");
                    } else {
                        toast.error(selectedUser ? "Update error user" : "Create error new user");
                    }
                });
        }
    }
    return (
        <>
            <div
                className='mb-3'
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3>Table Users</h3>
                <Button
                    variant='secondary'
                    onClick={() => {
                        setselectedUser(null);
                        setShowModalCreate(true);
                    }}
                >
                    Add new
                </Button>
            </div>

            <div className="container ">
                <Table bordered hover size='sm'>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Email</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{users.length - index}</td>
                                    <td>{item.email}</td>
                                    <td>{item.name}</td>
                                    <td>{item.role}</td>
                                    <td>
                                        <Link
                                            className='btn btn-primary'
                                            href={`users/${item.id}`}>
                                            View
                                        </Link>
                                        <Button variant='warning' className='mx-3' onClick={() => handleEditUser(item)}>
                                            Edit
                                        </Button>
                                        <Button variant='danger'
                                            onClick={() => handleDeleteUser(item.id)} >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <CreateModal
                    showModalCreate={showModalCreate}
                    setShowModalCreate={setShowModalCreate}
                    selectedUser={selectedUser}
                />
            </div>
        </>
    );
};

export default AppTable;
