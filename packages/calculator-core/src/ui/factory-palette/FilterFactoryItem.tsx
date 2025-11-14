import { css } from '@doubleaxe/daxfb-calculator-styles/css';
import { hstack } from '@doubleaxe/daxfb-calculator-styles/patterns';
import { Button, ButtonGroup, CloseButton, Combobox, InputBase, Pagination, useCombobox } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { action } from 'mobx';
import { Observer, observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';

import { useGameDataBase } from '#core/game/parser';
import { useFilterStoreBase } from '#core/stores/FilterStoreBase';

import GameIcon from '../components/GameIcon';

const ITEMS_PER_PAGE = 10;

const FilterFactoryItem = observer(() => {
    const gameData = useGameDataBase();
    const filter = useFilterStoreBase();

    const combobox = useCombobox({});
    const [search, setSearch] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 400);
    const [requestedPage, setRequestedPage] = useState(1);

    const filteredItems = useMemo(() => {
        const allItems = gameData.gameItemsArray;
        if (!debouncedSearch.trim()) {
            return allItems;
        }

        const searchTerms = debouncedSearch
            .toLowerCase()
            .split(/\s+/)
            .map((s) => s.trim());
        return allItems.filter((item) => searchTerms.every((term) => !term || item.lowerLabel.includes(term)));
    }, [gameData, debouncedSearch]);

    const selectedItem = useMemo(
        () => (filter.key ? gameData.getGameItem(filter.key) : undefined),
        [filter.key, gameData]
    );

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE) || 1;
    const effectivePage = Math.min(requestedPage, totalPages);
    const currentPageItems = useMemo(() => {
        const start = (effectivePage - 1) * ITEMS_PER_PAGE;
        return filteredItems.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredItems, effectivePage]);

    const handleSearchChange = action((value: null | string) => {
        filter.setKey(value ?? undefined);
    });

    const canReset = !!(search || filter.key);
    const handleSearchReset = action(() => {
        filter.setKey(undefined);
        setSearch('');
    });

    const handleDirectionChange = action((value: number) => {
        filter.setDirection(value);
    });

    const options = currentPageItems.map((item) => (
        <Combobox.Option
            className={css({
                '&[data-combobox-selected]': {
                    backgroundColor: 'var(--mantine-primary-color-light)',
                    color: 'var(--mantine-color-text)',
                },
            })}
            key={item.key}
            selected={item.key === filter.key}
            value={item.key}
        >
            <div className={hstack({ gap: 'var(--mantine-spacing-xs)' })}>
                <GameIcon image={item.image} />
                {item.label}
            </div>
        </Combobox.Option>
    ));

    return (
        <div className={hstack({ gap: 'var(--mantine-spacing-xs)' })}>
            <Combobox
                onOptionSubmit={(val) => {
                    handleSearchChange(val);
                    combobox.closeDropdown();
                }}
                store={combobox}
                width={'auto'}
            >
                <Combobox.Target>
                    <InputBase
                        leftSection={
                            selectedItem && <Observer>{() => <GameIcon image={selectedItem.image} />}</Observer>
                        }
                        onBlur={() => {
                            combobox.closeDropdown();
                        }}
                        onChange={(event) => {
                            combobox.openDropdown();
                            combobox.updateSelectedOptionIndex();
                            setSearch(event.currentTarget.value);
                        }}
                        onClick={() => combobox.openDropdown()}
                        onFocus={() => combobox.openDropdown()}
                        placeholder='Filter item...'
                        rightSection={
                            canReset ? (
                                <CloseButton
                                    aria-label='Clear value'
                                    onClick={handleSearchReset}
                                    onMouseDown={(event) => event.preventDefault()}
                                    size='sm'
                                />
                            ) : (
                                <Combobox.Chevron />
                            )
                        }
                        rightSectionPointerEvents={canReset ? 'all' : 'none'}
                        value={search}
                    />
                </Combobox.Target>
                <Combobox.Dropdown>
                    <Combobox.Options style={{ overflowY: 'auto', maxHeight: '20rem' }}>
                        <ButtonGroup className={css({ justifySelf: 'center' })}>
                            <Button
                                onClick={() => handleDirectionChange(-1)}
                                size='xs'
                                variant={filter.direction === -1 ? 'filled' : 'outline'}
                            >
                                Input
                            </Button>
                            <Button
                                onClick={() => handleDirectionChange(0)}
                                size='xs'
                                variant={filter.direction === 0 ? 'filled' : 'outline'}
                            >
                                All
                            </Button>
                            <Button
                                onClick={() => handleDirectionChange(1)}
                                size='xs'
                                variant={filter.direction === 1 ? 'filled' : 'outline'}
                            >
                                Output
                            </Button>
                        </ButtonGroup>
                        {options.length > 0 ? options : <Combobox.Empty>Nothing found</Combobox.Empty>}
                    </Combobox.Options>
                    <Combobox.Footer>
                        <Pagination.Root
                            classNames={{ root: css({ flexWrap: 'nowrap' }) }}
                            disabled={filteredItems.length === 0}
                            onChange={(newPage) => setRequestedPage(newPage)}
                            size='sm'
                            total={totalPages}
                            value={effectivePage}
                        >
                            <div className={hstack({ gap: 'var(--mantine-spacing-xs)' })}>
                                <Pagination.Previous />
                                <Pagination.Items />
                                <Pagination.Next />
                            </div>
                        </Pagination.Root>
                    </Combobox.Footer>
                </Combobox.Dropdown>
            </Combobox>
        </div>
    );
});

export default FilterFactoryItem;
