import type { GameItemBase } from '#core/game/parser';

import GameIcon from '../components/GameIcon';
import iconStyles from '../styles/Dragging';

type Props = {
    isSelected?: boolean;
    item: GameItemBase | undefined;
};

export default function GameIconDragging({ item }: Props) {
    return <div className={iconStyles}>{item ? <GameIcon image={item?.image} /> : undefined}</div>;
}
