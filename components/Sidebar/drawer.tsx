import { Box, Drawer as ChakraDrawer, DrawerContent, DrawerOverlay, DrawerProps as ChakraDrawerProps } from '@chakra-ui/react'

interface CustomDrawerProps extends ChakraDrawerProps {
  onClose: () => void
}

const Drawer: React.FC<CustomDrawerProps> = ({ children, onClose, ...rest }) => {
  return (
    <ChakraDrawer placement="left" onClose={onClose} {...rest}>
      <DrawerOverlay>
        <DrawerContent>
          <Box p={4}>
            {children}
          </Box>
        </DrawerContent>
      </DrawerOverlay>
    </ChakraDrawer>
  )
}

export default Drawer
