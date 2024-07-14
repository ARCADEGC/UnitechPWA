import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/Typography";

function NotFound() {
    return (
        <div className="space-y-4">
            <Typography variant="h2">Not Found</Typography>
            <Typography>Could not find requested resource</Typography>
            <Button asChild>
                <Link href="/">Return Home</Link>
            </Button>
        </div>
    );
}

export default NotFound;
