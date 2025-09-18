import { Anchor, AppShell, Container, List, Paper, Text, Title } from '@mantine/core';
import { Link, NavLink } from 'react-router';

export default function LandingPage() {
    return (
        <AppShell footer={{ height: 60 }} p='md'>
            <AppShell.Main>
                <Container size='sm' mt='xl'>
                    <Paper p='xl' shadow='xs'>
                        <Title order={1} ta='center' mb='lg'>
                            Game Selector
                        </Title>
                        <List spacing='md' size='md' withPadding>
                            <List.Item>
                                <Anchor component={Link} to={'?gameId=coi'} size='lg'>
                                    Factorio
                                </Anchor>
                            </List.Item>
                        </List>
                    </Paper>
                </Container>
            </AppShell.Main>
            <AppShell.Footer>
                <Text ta='center' size='sm'>
                    Extra small text
                </Text>
            </AppShell.Footer>
        </AppShell>
    );
}
