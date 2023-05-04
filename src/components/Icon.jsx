import { Tooltip, IconButton, Link, } from "@mui/material"

const Icon = (props) => {
    const { tooltip, link, icon, } = props
    return (
        <Link href={ link }>
            <Tooltip title={ tooltip }>
                <IconButton>
                    { icon }
                </IconButton>
            </Tooltip>
        </Link>
    )
}

export default Icon