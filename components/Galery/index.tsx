import React, { useState } from 'react';
import { Stack, Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton, Button, VStack } from "@chakra-ui/react";
import { Trash } from 'lucide-react';
import Image from 'next/image';

//@ts-ignore
const Gallery = ({ photos, onClick }) => {
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Número de imagens por página

    //@ts-ignore
    const openModal = (photo) => {
        setSelectedPhoto(photo);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedPhoto(null);
        setIsModalOpen(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPhotos = photos.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(photos.length / itemsPerPage);

    //@ts-ignore
    const changePage = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            <VStack align="center">
                <Stack direction="row" spacing={4} flexWrap="wrap" mb={4} wrap="wrap">

                    {/* @ts-ignore */}
                    {currentPhotos.map((photo, index) => (
                        <>
                            <div className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                                <div className="z-10 absolute top-2 right-2">
                                    <div className="w-10 h-10 bg-red-500 rounded-md flex items-center justify-center">
                                        <Button type="button" variant="ghost" size="sm" onClick={() => onClick(photo.id)}>
                                            <Trash className="h-10 w-10 text-white" />
                                        </Button>
                                    </div>
                                </div>
                                <div className='cursor-pointer'>
                                    <Image
                                        key={index}
                                        src={photo.url}
                                        alt={`Photo ${index + 1}`}
                                        onClick={() => openModal(photo)}
                                        // borderRadius="md"
                                        // boxSize='150px' 
                                        fill
                                        className="object-cover"

                                    />
                                </div>
                            </div >
                        </>
                    ))}
                </Stack>

                {/* Botões de Paginação */}
                <Stack direction="row" spacing={2} justify="center">
                    {Array.from({ length: totalPages }, (_, i) => (
                        <Button
                            key={i + 1}
                            onClick={() => changePage(i + 1)}
                            colorScheme={currentPage === i + 1 ? 'teal' : 'gray'}
                        >
                            {i + 1}
                        </Button>
                    ))}
                </Stack>
            </VStack>

            {/* Modal para visualização em tela cheia */}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        {selectedPhoto && (
                            <Image
                                //@ts-ignore
                                src={selectedPhoto.url}
                                alt="Full-screen Photo"
                                width={600}
                                height={500}
                                //@ts-ignore
                                borderRadius="md"
                            />
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default Gallery;
