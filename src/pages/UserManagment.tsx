import { UserLogin } from "../components/UserCreate";
import { DeleteUserByIdDropdown } from "../components/UserManage";
import { UserTable } from "../components/UserTable";

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
                <div className="row">
                    <DeleteUserByIdDropdown />
                </div>
            </div>
        </div>
    );
}