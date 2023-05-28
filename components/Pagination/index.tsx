import { HStack } from "@chakra-ui/react"
import { ReactNode } from "react"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"

import { ButtonPagination } from "../Buttons"
import ReactPaginate from "react-paginate"

interface PaginationProps {
    children?: ReactNode
    pageCount: any
    handlePageClick: any
}

export function Pagination({ children, pageCount, handlePageClick }: PaginationProps) {
    return (
        <HStack
            spacing={2}
            justify={"end"}
        >
            <ReactPaginate
                pageCount={pageCount}
                onPageChange={handlePageClick}
                pageClassName="border border-gray-200 px-4 py-2 mx-1 rounded-lg fontSize=14px"
                activeClassName="bg-blue-500 text-white border-blue-500"
                previousLabel={<ButtonPagination button={<MdKeyboardArrowLeft />} fontSize={"16px"} />}
                nextLabel={<ButtonPagination button={<MdKeyboardArrowRight />} fontSize={"16px"} />}
                containerClassName="flex flex-row justify-end"
            />

        </HStack>
    )
}

