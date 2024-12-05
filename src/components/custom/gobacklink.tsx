import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export function GoBackLink() {
    const navigate = useNavigate();
    return (
        <div className="mb-4">
            <Button variant="link" onClick={() => navigate(-1)}>
                <ArrowLeftIcon className='mr-2 h-4 w-4' />
                Go Back
            </Button>
        </div>
    );
}