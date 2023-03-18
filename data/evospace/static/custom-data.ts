import type {LogisticSerialized} from '#types/game-data-serialized';

export const logistic: LogisticSerialized[] = [{
    name: 'RobotArm90',
    items: [{
        name: 'AnySolidStaticItem',
    }],
    transport: [{
        name: 'CopperRobotArmStaticItem',
        label: 'Copper Robot Arm 90°',
        count: 150,
    }, {
        name: 'SteelRobotArmStaticItem',
        label: 'Steel Robot Arm 90°',
        count: 225,
    }, {
        name: 'AluminiumRobotArmStaticItem',
        label: 'Aluminium Robot Arm 90°',
        count: 300,
    }, {
        name: 'StainlessSteelRobotArmStaticItem',
        label: 'Stainless Steel Robot Arm 90°',
        count: 450,
    }, {
        name: 'TitaniumRobotArmStaticItem',
        label: 'Titanium Robot Arm 90°',
        count: 600,
    }, {
        name: 'HardMetalRobotArmStaticItem',
        label: 'Hard Metal Robot Arm 90°',
        count: 900,
    }, {
        name: 'NeutroniumRobotArmStaticItem',
        label: 'Neutronium Robot Arm 90°',
        count: 1800,
    }],
    time: 3600,
}, {
    name: 'RobotArm180',
    items: [{
        name: 'AnySolidStaticItem',
    }],
    transport: [{
        name: 'CopperRobotArmStaticItem',
        label: 'Copper Robot Arm 180°',
        count: 150,
    }, {
        name: 'SteelRobotArmStaticItem',
        label: 'Steel Robot Arm 180°',
        count: 225,
    }, {
        name: 'AluminiumRobotArmStaticItem',
        label: 'Aluminium Robot Arm 180°',
        count: 300,
    }, {
        name: 'StainlessSteelRobotArmStaticItem',
        label: 'Stainless Steel Robot Arm 180°',
        count: 450,
    }, {
        name: 'TitaniumRobotArmStaticItem',
        label: 'Titanium Robot Arm 180°',
        count: 600,
    }, {
        name: 'HardMetalRobotArmStaticItem',
        label: 'Hard Metal Robot Arm 180°',
        count: 900,
    }, {
        name: 'NeutroniumRobotArmStaticItem',
        label: 'Neutronium Robot Arm 180°',
        count: 1800,
    }],
    time: 7200,
}, {
    name: 'Conveyor',
    items: [{
        name: 'AnySolidStaticItem',
    }],
    transport: [{
        name: 'CopperConveyorStaticItem',
        count: 5,
    }, {
        name: 'SteelConveyorStaticItem',
        count: 7.5,
    }, {
        name: 'AluminiumConveyorStaticItem',
        count: 10,
    }, {
        name: 'StainlessSteelConveyorStaticItem',
        count: 15,
    }, {
        name: 'TitaniumConveyorStaticItem',
        count: 20,
    }, {
        name: 'HardMetalConveyorStaticItem',
        count: 30,
    }, {
        name: 'NeutroniumConveyorStaticItem',
        count: 60,
    }],
    time: 60,
}];
