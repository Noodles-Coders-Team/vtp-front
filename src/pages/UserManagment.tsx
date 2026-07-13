import { UserLogin } from "../components/userPageCpmponent/UserCreate";
import { DeleteUserByIdDropdown } from "../components/userPageCpmponent/UserDelete";
import { UserTable } from "../components/userPageCpmponent/UserTable";

export default function UserManagmentPage() {
    return (
        <div
            style={{
                width: '80%'
            }}
            className="container text-center"
        >
            <div className="row">
                <div className="col">
                    <UserLogin />
                </div>
                <div className="col">
                    <UserTable />
                </div>
            </div>
            <div className="row" style={{ width: '50%' }}>
                <DeleteUserByIdDropdown />
            </div>
        </div>
    );
}