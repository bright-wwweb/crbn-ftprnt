import React, { useRef } from "react"

interface ILinkProps {
    link: d3Link
}

interface ILinksProps {
    links: d3Link[]
}


const Link: React.FC<ILinkProps> = (props) => {
    const ref = useRef(null)
    return (
        <line className="link" ref={ref}
              strokeWidth={Math.sqrt(props.link.value)} />
    )
}

const Links: React.FC<ILinksProps> = (props) => {
    const links = props.links.map((link: d3Link, index: number) => {
        return <Link key={index} link={link} />
    })

    return (
        <g className="links">
            {links}
        </g>
    )
}

export default Links
