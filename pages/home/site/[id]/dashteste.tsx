import { Grid, GridItem, SimpleGrid, Stack } from "@chakra-ui/layout";
import Header from "../../../../components/Dashboard/Sales/header";
import Sales from "../../../../components/Dashboard/Sales";

export default function Dashboard() {
    return (
        <>
            <Grid
                w="full"
                gap={8}
                templateColumns={["repeat(1, 1fr)", "auto 300px"]}
            >
                <SimpleGrid columns={12} w="full">
                    <GridItem colSpan={12}>
                        <Header />
                    </GridItem>
                </SimpleGrid>
                <Sales />
            </Grid>
        </>
    );
}