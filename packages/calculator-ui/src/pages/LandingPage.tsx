import { Anchor, AppShell, Container, List, Paper, Text, Title } from '@mantine/core';

import { GameIds } from '#types/constants';

export default function LandingPage() {
    return (
        <AppShell footer={{ height: 60 }} p='md'>
            <AppShell.Main>
                <Container mt='xl' size='sm'>
                    <Paper p='xl' shadow='xs'>
                        <Title mb='lg' order={1} ta='center'>
                            Select Game
                        </Title>
                        <List size='md' spacing='md' withPadding>
                            <List.Item>
                                <Anchor href={`?gameId=${GameIds.COI}`} size='lg'>
                                    Captain of Industry
                                </Anchor>
                            </List.Item>
                        </List>
                    </Paper>
                </Container>
            </AppShell.Main>
            <AppShell.Footer>
                <Text size='sm' ta='center'>
                    Extra small text
                </Text>
            </AppShell.Footer>
        </AppShell>
    );
}
