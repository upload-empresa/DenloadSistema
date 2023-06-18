import { useState } from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { HStack } from '@chakra-ui/react';

interface RatingStarProps {
    onChange: any
}

const RatingStar = ({ onChange }: RatingStarProps) => {
    const [rating, setRating] = useState(0);

    const handleClick = (index: any) => {
        const newRating = index + 1;
        setRating(newRating);
        onChange(newRating); // Atualiza o valor da nota no componente pai
    };

    return (


        <HStack
            spacing={1}
        >
            {
                [...Array(5)].map((_, index) => (
                    <StarIcon
                        key={index}
                        boxSize={6}
                        color={index < rating ? 'yellow.500' : 'gray.300'}
                        _hover={{ cursor: 'pointer', color: 'yellow.500' }}
                        onClick={() => handleClick(index)}
                        onChange={onChange}
                    />
                ))
            }
        </HStack>


    );
};

export default RatingStar;
