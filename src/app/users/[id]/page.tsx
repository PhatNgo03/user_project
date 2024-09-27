'use client'
import Link from "next/link";
import { Card } from "react-bootstrap";
import useSWR, { Fetcher } from 'swr'


const ViewDetailUser = ({ params }: { params: { id: string } }) => {

    const fetcher: Fetcher<IUser, string> = (url: string) => fetch(url).then(res => res.json());


    const { data, error, isLoading } = useSWR(`http://localhost:8000/users/${params.id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    });
    if (isLoading) {
        return <div>loading...</div>;
    }

    if (error) {
        return <div>Failed to load data</div>;
    }


    return (
        <div>
            <div className="my-3">
                <Link href={"/users"}> Go Back</Link>
            </div>
            <Card className="card text-center">
                <Card.Header className="card-header">
                    {data?.email}
                </Card.Header>
                <Card.Body className="card-body">
                    <p className="card-text">
                        {data?.name}
                    </p>
                </Card.Body>
                <Card.Footer className="card-footer">
                    {data?.role}
                </Card.Footer>
            </Card>
        </div>
    )
}
export default ViewDetailUser;