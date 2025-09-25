import type { GameItemCoiJson } from '#daxfb-shared/types/gamedata/coi.js';
export const itemsJson: GameItemCoiJson[] = [
  {
    "image": [
      0,
      0
    ],
    "key": "6I",
    "name": "Acid",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 100,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      1,
      0
    ],
    "key": "3y",
    "name": "AirSeparator",
    "recipe": {
      "key": "3y"
    }
  },
  {
    "image": [
      2,
      0
    ],
    "key": "6K",
    "name": "Ammonia",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      3,
      0
    ],
    "key": "S",
    "name": "AnaerobicDigester",
    "recipe": {
      "key": "S"
    }
  },
  {
    "image": [
      4,
      0
    ],
    "key": "6L",
    "name": "Anesthetics",
    "type": 2
  },
  {
    "image": [
      5,
      0
    ],
    "key": "6M",
    "name": "AnimalFeed",
    "type": 3
  },
  {
    "image": [
      6,
      0
    ],
    "key": "6N",
    "name": "Antibiotics",
    "type": 2
  },
  {
    "flags": 1,
    "image": [
      7,
      0
    ],
    "key": "aL",
    "name": "AnyCountableProduct",
    "type": 2
  },
  {
    "flags": 1,
    "image": [
      8,
      0
    ],
    "key": "aM",
    "name": "AnyFluidProduct",
    "type": 1
  },
  {
    "flags": 1,
    "image": [
      9,
      0
    ],
    "key": "aN",
    "name": "AnyLooseProduct",
    "type": 3
  },
  {
    "flags": 1,
    "image": [
      0,
      1
    ],
    "key": "aO",
    "name": "AnyMoltenProduct",
    "type": 4
  },
  {
    "image": [
      1,
      1
    ],
    "key": "ak",
    "name": "AnyMoltenStorage",
    "recipe": {
      "key": "ak"
    }
  },
  {
    "flags": 1,
    "image": [
      2,
      1
    ],
    "key": "aP",
    "name": "AnyVirtualProduct",
    "type": 6
  },
  {
    "image": [
      3,
      1
    ],
    "key": "ag",
    "name": "AnyVirtualStorage",
    "recipe": {
      "key": "ag"
    }
  },
  {
    "cost": [
      {
        "count": 25,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      8,
      1
    ],
    "key": "3r",
    "name": "AssemblyManual",
    "nextTier": "AssemblyElectrified",
    "recipe": {
      "key": "3r"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      6,
      1
    ],
    "key": "3h",
    "name": "AssemblyElectrified",
    "nextTier": "AssemblyElectrifiedT2",
    "prevTier": "AssemblyManual",
    "recipe": {
      "key": "3h"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      7,
      1
    ],
    "key": "2O",
    "name": "AssemblyElectrifiedT2",
    "nextTier": "AssemblyRoboticT1",
    "prevTier": "AssemblyElectrified",
    "recipe": {
      "key": "2O"
    },
    "tier": 2
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      9,
      1
    ],
    "key": "2o",
    "name": "AssemblyRoboticT1",
    "nextTier": "AssemblyRoboticT2",
    "prevTier": "AssemblyElectrifiedT2",
    "recipe": {
      "key": "2o"
    },
    "tier": 3
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      0,
      2
    ],
    "key": "2d",
    "name": "AssemblyRoboticT2",
    "prevTier": "AssemblyRoboticT1",
    "recipe": {
      "key": "2d"
    },
    "tier": 4
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      1,
      2
    ],
    "key": "6x",
    "name": "BakingUnit",
    "recipe": {
      "key": "6x"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      2,
      2
    ],
    "key": "9",
    "name": "BasicDieselDistiller",
    "recipe": {
      "key": "9"
    }
  },
  {
    "image": [
      3,
      2
    ],
    "key": "6O",
    "name": "Biomass",
    "type": 3
  },
  {
    "image": [
      4,
      2
    ],
    "key": "cY",
    "name": "BlanketFuel",
    "type": 1
  },
  {
    "image": [
      5,
      2
    ],
    "key": "cZ",
    "name": "BlanketFuelEnriched",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      6,
      2
    ],
    "key": "1i",
    "name": "BoilerCoal",
    "recipe": {
      "key": "1i"
    }
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      7,
      2
    ],
    "key": "1u",
    "name": "BoilerElectric",
    "recipe": {
      "key": "1u"
    }
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      8,
      2
    ],
    "key": "1m",
    "name": "BoilerGas",
    "recipe": {
      "key": "1m"
    }
  },
  {
    "image": [
      9,
      2
    ],
    "key": "6P",
    "name": "Bread",
    "type": 2
  },
  {
    "image": [
      0,
      3
    ],
    "key": "6Q",
    "name": "Bricks",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      1,
      3
    ],
    "key": "1K",
    "name": "BricksMaker",
    "recipe": {
      "key": "1K"
    }
  },
  {
    "image": [
      2,
      3
    ],
    "key": "6R",
    "name": "Brine",
    "type": 1
  },
  {
    "image": [
      3,
      3
    ],
    "key": "6S",
    "name": "BrokenGlass",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 15,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      4,
      3
    ],
    "key": "10",
    "name": "Burner",
    "recipe": {
      "key": "10"
    }
  },
  {
    "image": [
      5,
      3
    ],
    "key": "6T",
    "name": "Cake",
    "type": 2
  },
  {
    "image": [
      6,
      3
    ],
    "key": "6U",
    "name": "Canola",
    "type": 3
  },
  {
    "image": [
      7,
      3
    ],
    "key": "6V",
    "name": "CarbonDioxide",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      1,
      5
    ],
    "key": "57",
    "name": "Caster",
    "nextTier": "CasterT2",
    "recipe": {
      "key": "57"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      },
      {
        "count": 20,
        "key": "8Y",
        "name": "Steel"
      }
    ],
    "image": [
      4,
      5
    ],
    "key": "54",
    "name": "CasterT2",
    "prevTier": "Caster",
    "recipe": {
      "key": "54"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      2,
      5
    ],
    "key": "52",
    "name": "CasterCooled",
    "nextTier": "CasterCooledT2",
    "recipe": {
      "key": "52"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      3,
      5
    ],
    "key": "50",
    "name": "CasterCooledT2",
    "prevTier": "CasterCooled",
    "recipe": {
      "key": "50"
    },
    "tier": 1
  },
  {
    "image": [
      5,
      5
    ],
    "key": "6W",
    "name": "Cement",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      6,
      5
    ],
    "key": "4m",
    "name": "CharcoalMaker",
    "recipe": {
      "key": "4m"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      7,
      5
    ],
    "key": "5D",
    "name": "ChemicalPlant",
    "nextTier": "ChemicalPlant2",
    "recipe": {
      "key": "5D"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      8,
      5
    ],
    "key": "5s",
    "name": "ChemicalPlant2",
    "prevTier": "ChemicalPlant",
    "recipe": {
      "key": "5s"
    },
    "tier": 1
  },
  {
    "image": [
      0,
      6
    ],
    "key": "6X",
    "name": "ChickenCarcass",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      6
    ],
    "key": "9Z",
    "name": "ChickenFarm",
    "recipe": {
      "key": "9Z"
    }
  },
  {
    "image": [
      2,
      6
    ],
    "key": "6Y",
    "name": "ChilledWater",
    "type": 1
  },
  {
    "image": [
      3,
      6
    ],
    "key": "6Z",
    "name": "Chlorine",
    "type": 1
  },
  {
    "image": [
      4,
      6
    ],
    "key": "70",
    "name": "Coal",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 25,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      5,
      6
    ],
    "key": "bB",
    "name": "Compactor",
    "recipe": {
      "key": "bB"
    }
  },
  {
    "image": [
      6,
      6
    ],
    "key": "71",
    "name": "Compost",
    "type": 3
  },
  {
    "image": [
      7,
      6
    ],
    "key": "72",
    "name": "Computing",
    "type": 6,
    "type2": 3
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      8,
      6
    ],
    "key": "1S",
    "name": "ConcreteMixer",
    "nextTier": "ConcreteMixerT2",
    "recipe": {
      "key": "1S"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      9,
      6
    ],
    "key": "1P",
    "name": "ConcreteMixerT2",
    "nextTier": "ConcreteMixerT3",
    "prevTier": "ConcreteMixer",
    "recipe": {
      "key": "1P"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      0,
      7
    ],
    "key": "1M",
    "name": "ConcreteMixerT3",
    "prevTier": "ConcreteMixerT2",
    "recipe": {
      "key": "1M"
    },
    "tier": 2
  },
  {
    "image": [
      1,
      7
    ],
    "key": "73",
    "name": "ConcreteSlab",
    "type": 2
  },
  {
    "image": [
      2,
      7
    ],
    "key": "74",
    "name": "ConstructionParts",
    "type": 2
  },
  {
    "image": [
      3,
      7
    ],
    "key": "75",
    "name": "ConstructionParts2",
    "type": 2
  },
  {
    "image": [
      4,
      7
    ],
    "key": "76",
    "name": "ConstructionParts3",
    "type": 2
  },
  {
    "image": [
      5,
      7
    ],
    "key": "77",
    "name": "ConstructionParts4",
    "type": 2
  },
  {
    "image": [
      6,
      7
    ],
    "key": "78",
    "name": "ConsumerElectronics",
    "type": 2
  },
  {
    "image": [
      7,
      7
    ],
    "key": "79",
    "name": "CookingOil",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 40,
        "key": "73",
        "name": "ConcreteSlab"
      }
    ],
    "image": [
      8,
      7
    ],
    "key": "4c",
    "name": "CoolingTowerT1",
    "nextTier": "CoolingTowerT2",
    "recipe": {
      "key": "4c"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 200,
        "key": "73",
        "name": "ConcreteSlab"
      }
    ],
    "image": [
      9,
      7
    ],
    "key": "4g",
    "name": "CoolingTowerT2",
    "prevTier": "CoolingTowerT1",
    "recipe": {
      "key": "4g"
    },
    "tier": 1
  },
  {
    "image": [
      0,
      8
    ],
    "key": "7a",
    "name": "Copper",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      1,
      8
    ],
    "key": "5a",
    "name": "CopperElectrolysis",
    "recipe": {
      "key": "5a"
    }
  },
  {
    "image": [
      2,
      8
    ],
    "key": "7b",
    "name": "CopperOre",
    "type": 3
  },
  {
    "image": [
      3,
      8
    ],
    "key": "7c",
    "name": "CopperOreCrushed",
    "type": 3
  },
  {
    "image": [
      4,
      8
    ],
    "key": "7d",
    "name": "CopperScrap",
    "type": 3
  },
  {
    "image": [
      5,
      8
    ],
    "key": "d0",
    "name": "CopperScrapPressed",
    "type": 2
  },
  {
    "image": [
      6,
      8
    ],
    "key": "d1",
    "name": "CoreFuel",
    "type": 1
  },
  {
    "image": [
      7,
      8
    ],
    "key": "d2",
    "name": "CoreFuelDirty",
    "type": 1
  },
  {
    "image": [
      8,
      8
    ],
    "key": "7e",
    "name": "Corn",
    "type": 3
  },
  {
    "image": [
      9,
      8
    ],
    "key": "7f",
    "name": "CornMash",
    "type": 1
  },
  {
    "image": [
      0,
      9
    ],
    "key": "7g",
    "name": "CrudeOil",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      1,
      9
    ],
    "key": "4o",
    "name": "Crusher",
    "recipe": {
      "key": "4o"
    }
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      2,
      9
    ],
    "key": "cf",
    "name": "CrusherLarge",
    "recipe": {
      "key": "cf"
    }
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 40,
        "key": "7o",
        "name": "Electronics3"
      }
    ],
    "image": [
      3,
      9
    ],
    "key": "6G",
    "name": "DataCenter",
    "recipe": {
      "key": "6G"
    }
  },
  {
    "image": [
      4,
      9
    ],
    "key": "7h",
    "name": "Diesel",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "74",
        "name": "ConstructionParts"
      },
      {
        "count": 20,
        "key": "7m",
        "name": "Electronics"
      }
    ],
    "image": [
      5,
      9
    ],
    "key": "8",
    "name": "DieselGenerator",
    "recipe": {
      "key": "8"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 60,
        "key": "7m",
        "name": "Electronics"
      }
    ],
    "image": [
      6,
      9
    ],
    "key": "b5",
    "name": "DieselGeneratorT2",
    "recipe": {
      "key": "b5"
    }
  },
  {
    "image": [
      7,
      9
    ],
    "key": "7i",
    "name": "Dirt",
    "type": 3
  },
  {
    "image": [
      8,
      9
    ],
    "key": "7j",
    "name": "Disinfectant",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      9,
      9
    ],
    "key": "5J",
    "name": "DistillationTowerT1",
    "recipe": {
      "key": "5J"
    }
  },
  {
    "cost": [
      {
        "count": 70,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      0,
      10
    ],
    "key": "5L",
    "name": "DistillationTowerT2",
    "recipe": {
      "key": "5L"
    }
  },
  {
    "cost": [
      {
        "count": 70,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      10
    ],
    "key": "5N",
    "name": "DistillationTowerT3",
    "recipe": {
      "key": "5N"
    }
  },
  {
    "image": [
      2,
      10
    ],
    "key": "7k",
    "name": "Eggs",
    "type": 2
  },
  {
    "image": [
      3,
      10
    ],
    "key": "7l",
    "name": "Electricity",
    "type": 6,
    "type2": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      4,
      10
    ],
    "key": "40",
    "name": "Electrolyzer",
    "nextTier": "ElectrolyzerT2",
    "recipe": {
      "key": "40"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      5,
      10
    ],
    "key": "c0",
    "name": "ElectrolyzerT2",
    "prevTier": "Electrolyzer",
    "recipe": {
      "key": "c0"
    },
    "tier": 1
  },
  {
    "image": [
      6,
      10
    ],
    "key": "7m",
    "name": "Electronics",
    "type": 2
  },
  {
    "image": [
      7,
      10
    ],
    "key": "7n",
    "name": "Electronics2",
    "type": 2
  },
  {
    "image": [
      8,
      10
    ],
    "key": "7o",
    "name": "Electronics3",
    "type": 2
  },
  {
    "image": [
      9,
      10
    ],
    "key": "7p",
    "name": "Ethanol",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      0,
      11
    ],
    "key": "1A",
    "name": "EvaporationPond",
    "nextTier": "EvaporationPondHeated",
    "recipe": {
      "key": "1A"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      11
    ],
    "key": "1w",
    "name": "EvaporationPondHeated",
    "prevTier": "EvaporationPond",
    "recipe": {
      "key": "1w"
    },
    "tier": 1
  },
  {
    "image": [
      2,
      11
    ],
    "key": "7q",
    "name": "Exhaust",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      3,
      11
    ],
    "key": "M",
    "name": "ExhaustScrubber",
    "recipe": {
      "key": "M"
    }
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      4,
      11
    ],
    "key": "9S",
    "name": "FarmT1",
    "nextTier": "FarmT2",
    "recipe": {
      "key": "9S"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      5,
      11
    ],
    "key": "9R",
    "name": "FarmT2",
    "nextTier": "FarmT3",
    "prevTier": "FarmT1",
    "recipe": {
      "key": "9R"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 100,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 320,
        "key": "7z",
        "name": "Glass"
      }
    ],
    "image": [
      6,
      11
    ],
    "key": "9Q",
    "name": "FarmT3",
    "nextTier": "FarmT4",
    "prevTier": "FarmT2",
    "recipe": {
      "key": "9Q"
    },
    "tier": 2
  },
  {
    "cost": [
      {
        "count": 200,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 640,
        "key": "7z",
        "name": "Glass"
      }
    ],
    "image": [
      7,
      11
    ],
    "key": "9l",
    "name": "FarmT4",
    "prevTier": "FarmT3",
    "recipe": {
      "key": "9l"
    },
    "tier": 3
  },
  {
    "cost": [
      {
        "count": 1500,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 200,
        "key": "7o",
        "name": "Electronics3"
      }
    ],
    "image": [
      8,
      11
    ],
    "key": "cK",
    "name": "FastBreederReactor",
    "recipe": {
      "key": "cK"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      9,
      11
    ],
    "key": "44",
    "name": "FermentationTank",
    "recipe": {
      "key": "44"
    }
  },
  {
    "image": [
      0,
      12
    ],
    "key": "7s",
    "name": "Fertilizer",
    "type": 1
  },
  {
    "image": [
      1,
      12
    ],
    "key": "7t",
    "name": "Fertilizer2",
    "type": 1
  },
  {
    "image": [
      2,
      12
    ],
    "key": "7r",
    "name": "FertilizerOrganic",
    "type": 1
  },
  {
    "image": [
      3,
      12
    ],
    "key": "7u",
    "name": "FilterMedia",
    "type": 3
  },
  {
    "image": [
      4,
      12
    ],
    "key": "d6",
    "name": "FissionProduct",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 10,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      5,
      12
    ],
    "key": "D",
    "name": "Flare",
    "recipe": {
      "key": "D"
    }
  },
  {
    "image": [
      6,
      12
    ],
    "key": "7v",
    "name": "Flour",
    "type": 2
  },
  {
    "image": [
      7,
      12
    ],
    "key": "aT",
    "name": "Flowers",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      8,
      12
    ],
    "key": "6k",
    "name": "FoodMill",
    "recipe": {
      "key": "6k"
    }
  },
  {
    "image": [
      9,
      12
    ],
    "key": "7w",
    "name": "FoodPack",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      0,
      13
    ],
    "key": "6p",
    "name": "FoodProcessor",
    "recipe": {
      "key": "6p"
    }
  },
  {
    "image": [
      1,
      13
    ],
    "key": "7x",
    "name": "Fruit",
    "type": 2
  },
  {
    "image": [
      2,
      13
    ],
    "key": "7y",
    "name": "FuelGas",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      6,
      13
    ],
    "key": "1c",
    "name": "GasInjectionPump",
    "recipe": {
      "key": "1c"
    }
  },
  {
    "image": [
      7,
      13
    ],
    "key": "7z",
    "name": "Glass",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      8,
      13
    ],
    "key": "5j",
    "name": "GlassMakerT1",
    "nextTier": "GlassMakerT2",
    "recipe": {
      "key": "5j"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      9,
      13
    ],
    "key": "5h",
    "name": "GlassMakerT2",
    "prevTier": "GlassMakerT1",
    "recipe": {
      "key": "5h"
    },
    "tier": 1
  },
  {
    "image": [
      0,
      14
    ],
    "key": "7A",
    "name": "GlassMix",
    "type": 3
  },
  {
    "image": [
      1,
      14
    ],
    "key": "7B",
    "name": "Gold",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 70,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      2,
      14
    ],
    "key": "5p",
    "name": "GoldFurnace",
    "recipe": {
      "key": "5p"
    }
  },
  {
    "image": [
      3,
      14
    ],
    "key": "7C",
    "name": "GoldOre",
    "type": 3
  },
  {
    "image": [
      4,
      14
    ],
    "key": "7D",
    "name": "GoldOreConcentrate",
    "type": 3
  },
  {
    "image": [
      5,
      14
    ],
    "key": "7E",
    "name": "GoldOreCrushed",
    "type": 3
  },
  {
    "image": [
      6,
      14
    ],
    "key": "7F",
    "name": "GoldOrePowder",
    "type": 3
  },
  {
    "image": [
      7,
      14
    ],
    "key": "7G",
    "name": "GoldScrap",
    "type": 3
  },
  {
    "image": [
      8,
      14
    ],
    "key": "d7",
    "name": "GoldScrapPressed",
    "type": 2
  },
  {
    "image": [
      9,
      14
    ],
    "key": "7H",
    "name": "Graphite",
    "type": 2
  },
  {
    "image": [
      0,
      15
    ],
    "key": "7I",
    "name": "Gravel",
    "type": 3
  },
  {
    "image": [
      2,
      15
    ],
    "key": "7J",
    "name": "HeavyOil",
    "type": 1
  },
  {
    "image": [
      3,
      15
    ],
    "key": "7K",
    "name": "HouseholdAppliances",
    "type": 2
  },
  {
    "image": [
      4,
      15
    ],
    "key": "7L",
    "name": "HouseholdGoods",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 100,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      8,
      15
    ],
    "key": "5V",
    "name": "HydroCrackerT1",
    "recipe": {
      "key": "5V"
    }
  },
  {
    "image": [
      9,
      15
    ],
    "key": "7M",
    "name": "Hydrogen",
    "type": 1
  },
  {
    "image": [
      0,
      16
    ],
    "key": "7N",
    "name": "HydrogenFluoride",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      16
    ],
    "key": "62",
    "name": "HydrogenReformer",
    "recipe": {
      "key": "62"
    }
  },
  {
    "image": [
      2,
      16
    ],
    "key": "7O",
    "name": "ImpureCopper",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 180,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      3,
      16
    ],
    "key": "bP",
    "name": "IncinerationPlant",
    "recipe": {
      "key": "bP"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      4,
      16
    ],
    "key": "1X",
    "name": "IndustrialMixer",
    "nextTier": "IndustrialMixerT2",
    "recipe": {
      "key": "1X"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      5,
      16
    ],
    "key": "bh",
    "name": "IndustrialMixerT2",
    "prevTier": "IndustrialMixer",
    "recipe": {
      "key": "bh"
    },
    "tier": 1
  },
  {
    "image": [
      6,
      16
    ],
    "key": "7P",
    "name": "Iron",
    "type": 2
  },
  {
    "image": [
      7,
      16
    ],
    "key": "7Q",
    "name": "IronOre",
    "type": 3
  },
  {
    "image": [
      8,
      16
    ],
    "key": "7R",
    "name": "IronOreCrushed",
    "type": 3
  },
  {
    "image": [
      9,
      16
    ],
    "key": "7S",
    "name": "IronScrap",
    "type": 3
  },
  {
    "image": [
      0,
      17
    ],
    "key": "d8",
    "name": "IronScrapPressed",
    "type": 2
  },
  {
    "image": [
      1,
      17
    ],
    "key": "7T",
    "name": "LabEquipment",
    "type": 2
  },
  {
    "image": [
      2,
      17
    ],
    "key": "7U",
    "name": "LabEquipment2",
    "type": 2
  },
  {
    "image": [
      3,
      17
    ],
    "key": "7V",
    "name": "LabEquipment3",
    "type": 2
  },
  {
    "image": [
      4,
      17
    ],
    "key": "7W",
    "name": "LabEquipment4",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      5,
      17
    ],
    "key": "1a",
    "name": "LandWaterPump",
    "recipe": {
      "key": "1a"
    }
  },
  {
    "image": [
      6,
      17
    ],
    "key": "7X",
    "name": "LightOil",
    "type": 1
  },
  {
    "image": [
      7,
      17
    ],
    "key": "7Y",
    "name": "Limestone",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      8,
      17
    ],
    "key": "6i",
    "name": "MaintenanceDepotT0",
    "nextTier": "MaintenanceDepotT1",
    "recipe": {
      "key": "6i"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      9,
      17
    ],
    "key": "6f",
    "name": "MaintenanceDepotT1",
    "nextTier": "MaintenanceDepotT2",
    "prevTier": "MaintenanceDepotT0",
    "recipe": {
      "key": "6f"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 10,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      0,
      18
    ],
    "key": "6c",
    "name": "MaintenanceDepotT2",
    "nextTier": "MaintenanceDepotT3",
    "prevTier": "MaintenanceDepotT1",
    "recipe": {
      "key": "6c"
    },
    "tier": 2
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 20,
        "key": "7o",
        "name": "Electronics3"
      }
    ],
    "image": [
      1,
      18
    ],
    "key": "69",
    "name": "MaintenanceDepotT3",
    "prevTier": "MaintenanceDepotT2",
    "recipe": {
      "key": "69"
    },
    "tier": 3
  },
  {
    "image": [
      2,
      18
    ],
    "key": "7Z",
    "name": "MaintenanceT1",
    "type": 6,
    "type2": 5
  },
  {
    "image": [
      3,
      18
    ],
    "key": "80",
    "name": "MaintenanceT2",
    "type": 6,
    "type2": 5
  },
  {
    "image": [
      4,
      18
    ],
    "key": "81",
    "name": "MaintenanceT3",
    "type": 6,
    "type2": 5
  },
  {
    "image": [
      5,
      18
    ],
    "key": "d9",
    "name": "ManufacturedSand",
    "type": 3
  },
  {
    "image": [
      6,
      18
    ],
    "key": "82",
    "name": "Meat",
    "type": 2
  },
  {
    "image": [
      7,
      18
    ],
    "key": "83",
    "name": "MeatTrimmings",
    "type": 3
  },
  {
    "image": [
      8,
      18
    ],
    "key": "84",
    "name": "MechanicalParts",
    "type": 2
  },
  {
    "image": [
      9,
      18
    ],
    "key": "85",
    "name": "MechPower",
    "type": 6,
    "type2": 2
  },
  {
    "image": [
      0,
      19
    ],
    "key": "86",
    "name": "MedicalEquipment",
    "type": 2
  },
  {
    "image": [
      1,
      19
    ],
    "key": "87",
    "name": "MedicalSupplies",
    "type": 2
  },
  {
    "image": [
      2,
      19
    ],
    "key": "88",
    "name": "MedicalSupplies2",
    "type": 2
  },
  {
    "image": [
      3,
      19
    ],
    "key": "89",
    "name": "MedicalSupplies3",
    "type": 2
  },
  {
    "image": [
      4,
      19
    ],
    "key": "8a",
    "name": "MediumOil",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      5,
      19
    ],
    "key": "3N",
    "name": "MicrochipMachine",
    "nextTier": "MicrochipMachineT2",
    "recipe": {
      "key": "3N"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      6,
      19
    ],
    "key": "3A",
    "name": "MicrochipMachineT2",
    "prevTier": "MicrochipMachine",
    "recipe": {
      "key": "3A"
    },
    "tier": 1
  },
  {
    "image": [
      7,
      19
    ],
    "key": "8b",
    "name": "Microchips",
    "type": 2
  },
  {
    "image": [
      8,
      19
    ],
    "key": "8c",
    "name": "MicrochipsStage1A",
    "type": 2
  },
  {
    "image": [
      9,
      19
    ],
    "key": "8d",
    "name": "MicrochipsStage1B",
    "type": 2
  },
  {
    "image": [
      0,
      20
    ],
    "key": "8e",
    "name": "MicrochipsStage1C",
    "type": 2
  },
  {
    "image": [
      1,
      20
    ],
    "key": "8f",
    "name": "MicrochipsStage2A",
    "type": 2
  },
  {
    "image": [
      2,
      20
    ],
    "key": "8g",
    "name": "MicrochipsStage2B",
    "type": 2
  },
  {
    "image": [
      3,
      20
    ],
    "key": "8h",
    "name": "MicrochipsStage2C",
    "type": 2
  },
  {
    "image": [
      4,
      20
    ],
    "key": "8i",
    "name": "MicrochipsStage3A",
    "type": 2
  },
  {
    "image": [
      5,
      20
    ],
    "key": "8j",
    "name": "MicrochipsStage3B",
    "type": 2
  },
  {
    "image": [
      6,
      20
    ],
    "key": "8k",
    "name": "MicrochipsStage3C",
    "type": 2
  },
  {
    "image": [
      7,
      20
    ],
    "key": "8l",
    "name": "MicrochipsStage4A",
    "type": 2
  },
  {
    "image": [
      8,
      20
    ],
    "key": "8m",
    "name": "MicrochipsStage4B",
    "type": 2
  },
  {
    "image": [
      0,
      21
    ],
    "key": "8n",
    "name": "MoltenCopper",
    "type": 4
  },
  {
    "image": [
      1,
      21
    ],
    "key": "8o",
    "name": "MoltenGlass",
    "type": 4
  },
  {
    "image": [
      2,
      21
    ],
    "key": "8p",
    "name": "MoltenIron",
    "type": 4
  },
  {
    "image": [
      3,
      21
    ],
    "key": "8q",
    "name": "MoltenSilicon",
    "type": 4
  },
  {
    "image": [
      4,
      21
    ],
    "key": "8r",
    "name": "MoltenSteel",
    "type": 4
  },
  {
    "image": [
      5,
      21
    ],
    "key": "8s",
    "name": "Morphine",
    "type": 2
  },
  {
    "image": [
      6,
      21
    ],
    "key": "da",
    "name": "MoxRod",
    "type": 2
  },
  {
    "image": [
      7,
      21
    ],
    "key": "8t",
    "name": "Naphtha",
    "type": 1
  },
  {
    "image": [
      8,
      21
    ],
    "key": "8u",
    "name": "Nitrogen",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 400,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      9,
      21
    ],
    "key": "6E",
    "name": "NuclearReactor",
    "nextTier": "NuclearReactorT2",
    "recipe": {
      "key": "6E"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 700,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      0,
      22
    ],
    "key": "cI",
    "name": "NuclearReactorT2",
    "prevTier": "NuclearReactor",
    "recipe": {
      "key": "cI"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 300,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      1,
      22
    ],
    "key": "c8",
    "name": "NuclearReprocessingPlant",
    "recipe": {
      "key": "c8"
    }
  },
  {
    "cost": [
      {
        "count": 150,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 500,
        "key": "73",
        "name": "ConcreteSlab"
      }
    ],
    "image": [
      2,
      22
    ],
    "key": "ad",
    "name": "NuclearWasteStorage",
    "recipe": {
      "key": "ad"
    }
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      3,
      22
    ],
    "key": "1g",
    "name": "OceanWaterPumpLarge",
    "recipe": {
      "key": "1g"
    }
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      4,
      22
    ],
    "key": "1e",
    "name": "OceanWaterPumpT1",
    "recipe": {
      "key": "1e"
    }
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      5,
      22
    ],
    "key": "18",
    "name": "OilPump",
    "recipe": {
      "key": "18"
    }
  },
  {
    "image": [
      6,
      22
    ],
    "key": "8w",
    "name": "Oxygen",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      7,
      22
    ],
    "key": "5f",
    "name": "OxygenFurnace",
    "nextTier": "OxygenFurnaceT2",
    "recipe": {
      "key": "5f"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 70,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      8,
      22
    ],
    "key": "5d",
    "name": "OxygenFurnaceT2",
    "prevTier": "OxygenFurnace",
    "recipe": {
      "key": "5d"
    },
    "tier": 1
  },
  {
    "image": [
      9,
      22
    ],
    "key": "db",
    "name": "Paper",
    "type": 2
  },
  {
    "image": [
      0,
      23
    ],
    "key": "8x",
    "name": "PCB",
    "type": 2
  },
  {
    "image": [
      1,
      23
    ],
    "key": "8y",
    "name": "Plastic",
    "type": 2
  },
  {
    "image": [
      2,
      23
    ],
    "key": "dc",
    "name": "Plutonium",
    "type": 2
  },
  {
    "image": [
      3,
      23
    ],
    "key": "6J",
    "name": "PollutedAir",
    "type": 6,
    "type2": 6
  },
  {
    "image": [
      4,
      23
    ],
    "key": "9g",
    "name": "PollutedWater",
    "type": 6,
    "type2": 6
  },
  {
    "cost": [
      {
        "count": 100,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      5,
      23
    ],
    "key": "66",
    "name": "PolymerizationPlant",
    "recipe": {
      "key": "66"
    }
  },
  {
    "image": [
      6,
      23
    ],
    "key": "8K",
    "name": "PolySilicon",
    "type": 2
  },
  {
    "image": [
      7,
      23
    ],
    "key": "8z",
    "name": "Poppy",
    "type": 3
  },
  {
    "image": [
      8,
      23
    ],
    "key": "8A",
    "name": "Potato",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "75",
        "name": "ConstructionParts2"
      },
      {
        "count": 20,
        "key": "7m",
        "name": "Electronics"
      }
    ],
    "image": [
      9,
      23
    ],
    "key": "4",
    "name": "PowerGeneratorT1",
    "nextTier": "PowerGeneratorT2",
    "recipe": {
      "key": "4"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 180,
        "key": "7m",
        "name": "Electronics"
      }
    ],
    "image": [
      0,
      24
    ],
    "key": "5",
    "name": "PowerGeneratorT2",
    "prevTier": "PowerGeneratorT1",
    "recipe": {
      "key": "5"
    },
    "tier": 1
  },
  {
    "image": [
      1,
      24
    ],
    "key": "8B",
    "name": "Quartz",
    "type": 3
  },
  {
    "image": [
      2,
      24
    ],
    "key": "dd",
    "name": "QuartzCrushed",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "74",
        "name": "ConstructionParts"
      },
      {
        "count": 30,
        "key": "9i",
        "name": "Wood"
      }
    ],
    "image": [
      3,
      24
    ],
    "key": "af",
    "name": "RainwaterHarvester",
    "recipe": {
      "key": "af"
    }
  },
  {
    "image": [
      4,
      24
    ],
    "key": "8C",
    "name": "Recyclables",
    "type": 3
  },
  {
    "image": [
      5,
      24
    ],
    "key": "de",
    "name": "RecyclablesPressed",
    "type": 2
  },
  {
    "image": [
      6,
      24
    ],
    "key": "aY",
    "name": "Research",
    "type": 6
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      7,
      24
    ],
    "key": "a0",
    "name": "ResearchLab1",
    "nextTier": "ResearchLab2",
    "recipe": {
      "key": "a0"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "75",
        "name": "ConstructionParts2"
      },
      {
        "count": 10,
        "key": "7T",
        "name": "LabEquipment"
      }
    ],
    "image": [
      8,
      24
    ],
    "key": "6D",
    "name": "ResearchLab2",
    "nextTier": "ResearchLab3",
    "prevTier": "ResearchLab1",
    "recipe": {
      "key": "6D"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 20,
        "key": "7U",
        "name": "LabEquipment2"
      }
    ],
    "image": [
      9,
      24
    ],
    "key": "6C",
    "name": "ResearchLab3",
    "nextTier": "ResearchLab4",
    "prevTier": "ResearchLab2",
    "recipe": {
      "key": "6C"
    },
    "tier": 2
  },
  {
    "cost": [
      {
        "count": 120,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 20,
        "key": "7V",
        "name": "LabEquipment3"
      }
    ],
    "image": [
      0,
      25
    ],
    "key": "6B",
    "name": "ResearchLab4",
    "nextTier": "ResearchLab5",
    "prevTier": "ResearchLab3",
    "recipe": {
      "key": "6B"
    },
    "tier": 3
  },
  {
    "cost": [
      {
        "count": 240,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 20,
        "key": "7W",
        "name": "LabEquipment4"
      }
    ],
    "image": [
      1,
      25
    ],
    "key": "6A",
    "name": "ResearchLab5",
    "prevTier": "ResearchLab4",
    "recipe": {
      "key": "6A"
    },
    "tier": 4
  },
  {
    "image": [
      2,
      25
    ],
    "key": "dg",
    "name": "RetiredWaste",
    "type": 2
  },
  {
    "image": [
      3,
      25
    ],
    "key": "8D",
    "name": "Rock",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      6,
      25
    ],
    "key": "4A",
    "name": "RotaryKiln",
    "nextTier": "RotaryKilnGas",
    "recipe": {
      "key": "4A"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      7,
      25
    ],
    "key": "4x",
    "name": "RotaryKilnGas",
    "prevTier": "RotaryKiln",
    "recipe": {
      "key": "4x"
    },
    "tier": 1
  },
  {
    "image": [
      8,
      25
    ],
    "key": "8E",
    "name": "Rubber",
    "type": 2
  },
  {
    "image": [
      9,
      25
    ],
    "key": "8F",
    "name": "Salt",
    "type": 3
  },
  {
    "image": [
      0,
      26
    ],
    "key": "8G",
    "name": "Sand",
    "type": 3
  },
  {
    "image": [
      1,
      26
    ],
    "key": "8H",
    "name": "Sausage",
    "type": 2
  },
  {
    "image": [
      2,
      26
    ],
    "key": "8I",
    "name": "Seawater",
    "type": 1
  },
  {
    "image": [
      3,
      26
    ],
    "key": "8J",
    "name": "Server",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      3,
      27
    ],
    "key": "48",
    "name": "SettlingTank",
    "recipe": {
      "key": "48"
    }
  },
  {
    "cost": [
      {
        "count": 25,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      4,
      27
    ],
    "key": "bH",
    "name": "Shredder",
    "recipe": {
      "key": "bH"
    }
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      5,
      27
    ],
    "key": "5l",
    "name": "SiliconCrystallizer",
    "recipe": {
      "key": "5l"
    }
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      6,
      27
    ],
    "key": "5n",
    "name": "SiliconReactor",
    "recipe": {
      "key": "5n"
    }
  },
  {
    "image": [
      7,
      27
    ],
    "key": "8L",
    "name": "SiliconWafer",
    "type": 2
  },
  {
    "image": [
      8,
      27
    ],
    "key": "8M",
    "name": "Slag",
    "type": 3
  },
  {
    "image": [
      9,
      27
    ],
    "key": "8N",
    "name": "SlagCrushed",
    "type": 3
  },
  {
    "image": [
      0,
      28
    ],
    "key": "8O",
    "name": "Sludge",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      1,
      28
    ],
    "key": "4T",
    "name": "SmeltingFurnaceT1",
    "nextTier": "SmeltingFurnaceT2",
    "recipe": {
      "key": "4T"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 180,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      2,
      28
    ],
    "key": "4M",
    "name": "SmeltingFurnaceT2",
    "nextTier": "ArcFurnace2",
    "prevTier": "SmeltingFurnaceT1",
    "recipe": {
      "key": "4M"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 160,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      4,
      1
    ],
    "key": "4K",
    "name": "ArcFurnace",
    "recipe": {
      "key": "4K"
    },
    "tier": 2
  },
  {
    "cost": [
      {
        "count": 140,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      5,
      1
    ],
    "key": "4C",
    "name": "ArcFurnace2",
    "prevTier": "SmeltingFurnaceT2",
    "recipe": {
      "key": "4C"
    },
    "tier": 3
  },
  {
    "cost": [
      {
        "count": 10,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      3,
      28
    ],
    "key": "k",
    "name": "SmokeStack",
    "recipe": {
      "key": "k"
    }
  },
  {
    "cost": [
      {
        "count": 10,
        "key": "74",
        "name": "ConstructionParts"
      },
      {
        "count": 40,
        "key": "73",
        "name": "ConcreteSlab"
      }
    ],
    "image": [
      4,
      28
    ],
    "key": "c",
    "name": "SmokeStackLarge",
    "recipe": {
      "key": "c"
    }
  },
  {
    "image": [
      5,
      28
    ],
    "key": "8P",
    "name": "Snack",
    "type": 2
  },
  {
    "image": [
      6,
      28
    ],
    "key": "8Q",
    "name": "SolarCell",
    "type": 2
  },
  {
    "image": [
      7,
      28
    ],
    "key": "8R",
    "name": "SolarCellMono",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 10,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 120,
        "key": "8Q",
        "name": "SolarCell"
      }
    ],
    "image": [
      8,
      28
    ],
    "key": "6",
    "name": "SolarPanel",
    "recipe": {
      "key": "6"
    }
  },
  {
    "cost": [
      {
        "count": 10,
        "key": "77",
        "name": "ConstructionParts4"
      },
      {
        "count": 120,
        "key": "8R",
        "name": "SolarCellMono"
      }
    ],
    "image": [
      9,
      28
    ],
    "key": "7",
    "name": "SolarPanelMono",
    "recipe": {
      "key": "7"
    }
  },
  {
    "image": [
      0,
      29
    ],
    "key": "8S",
    "name": "SourWater",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      29
    ],
    "key": "64",
    "name": "SourWaterStripper",
    "recipe": {
      "key": "64"
    }
  },
  {
    "image": [
      2,
      29
    ],
    "key": "8T",
    "name": "Soybean",
    "type": 3
  },
  {
    "image": [
      3,
      29
    ],
    "key": "8U",
    "name": "SpentFuel",
    "type": 2
  },
  {
    "image": [
      4,
      29
    ],
    "key": "dh",
    "name": "SpentMox",
    "type": 2
  },
  {
    "image": [
      5,
      29
    ],
    "key": "8V",
    "name": "SteamDepleted",
    "type": 1
  },
  {
    "image": [
      6,
      29
    ],
    "key": "8W",
    "name": "SteamHi",
    "type": 1
  },
  {
    "image": [
      7,
      29
    ],
    "key": "8X",
    "name": "SteamLP",
    "type": 1
  },
  {
    "image": [
      8,
      29
    ],
    "key": "di",
    "name": "SteamSp",
    "type": 1
  },
  {
    "image": [
      9,
      29
    ],
    "key": "8Y",
    "name": "Steel",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      0,
      30
    ],
    "key": "a9",
    "name": "StorageFluid",
    "nextTier": "StorageFluidT2",
    "recipe": {
      "key": "a9"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      4,
      30
    ],
    "key": "a5",
    "name": "StorageLoose",
    "nextTier": "StorageLooseT2",
    "recipe": {
      "key": "a5"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      8,
      30
    ],
    "key": "a1",
    "name": "StorageUnit",
    "nextTier": "StorageUnitT2",
    "recipe": {
      "key": "a1"
    },
    "tier": 0
  },
  {
    "image": [
      2,
      31
    ],
    "key": "8Z",
    "name": "Sugar",
    "type": 3
  },
  {
    "image": [
      3,
      31
    ],
    "key": "90",
    "name": "SugarCane",
    "type": 3
  },
  {
    "image": [
      4,
      31
    ],
    "key": "91",
    "name": "Sulfur",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 30,
        "key": "76",
        "name": "ConstructionParts3"
      },
      {
        "count": 30,
        "key": "8Y",
        "name": "Steel"
      }
    ],
    "image": [
      5,
      31
    ],
    "key": "1E",
    "name": "ThermalDesalinator",
    "recipe": {
      "key": "1E"
    }
  },
  {
    "image": [
      6,
      31
    ],
    "key": "92",
    "name": "Tofu",
    "type": 2
  },
  {
    "image": [
      7,
      31
    ],
    "key": "93",
    "name": "ToxicSlurry",
    "type": 1
  },
  {
    "image": [
      8,
      31
    ],
    "key": "dj",
    "name": "TreeSapling",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 50,
        "key": "75",
        "name": "ConstructionParts2"
      }
    ],
    "image": [
      9,
      31
    ],
    "key": "1",
    "name": "TurbineHighPress",
    "nextTier": "TurbineHighPressT2",
    "recipe": {
      "key": "1"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      0,
      32
    ],
    "key": "0",
    "name": "TurbineHighPressT2",
    "prevTier": "TurbineHighPress",
    "recipe": {
      "key": "0"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      1,
      32
    ],
    "key": "3",
    "name": "TurbineLowPress",
    "nextTier": "TurbineLowPressT2",
    "recipe": {
      "key": "3"
    },
    "tier": 0
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      2,
      32
    ],
    "key": "2",
    "name": "TurbineLowPressT2",
    "prevTier": "TurbineLowPress",
    "recipe": {
      "key": "2"
    },
    "tier": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      3,
      32
    ],
    "key": "b4",
    "name": "TurbineSuperPress",
    "recipe": {
      "key": "b4"
    }
  },
  {
    "image": [
      4,
      32
    ],
    "key": "94",
    "name": "Upoints",
    "type": 6,
    "type2": 4
  },
  {
    "image": [
      5,
      32
    ],
    "key": "d3",
    "name": "UraniumDepleted",
    "type": 3
  },
  {
    "image": [
      6,
      32
    ],
    "key": "d5",
    "name": "UraniumEnriched",
    "type": 2
  },
  {
    "image": [
      7,
      32
    ],
    "key": "d4",
    "name": "UraniumEnriched20",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 80,
        "key": "77",
        "name": "ConstructionParts4"
      }
    ],
    "image": [
      8,
      32
    ],
    "key": "4k",
    "name": "UraniumEnrichmentPlant",
    "recipe": {
      "key": "4k"
    }
  },
  {
    "image": [
      9,
      32
    ],
    "key": "95",
    "name": "UraniumOre",
    "type": 3
  },
  {
    "image": [
      0,
      33
    ],
    "key": "96",
    "name": "UraniumOreCrushed",
    "type": 3
  },
  {
    "image": [
      1,
      33
    ],
    "key": "df",
    "name": "UraniumReprocessed",
    "type": 2
  },
  {
    "image": [
      2,
      33
    ],
    "key": "98",
    "name": "UraniumRod",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 60,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      3,
      33
    ],
    "key": "5P",
    "name": "VacuumDistillationTower",
    "recipe": {
      "key": "5P"
    }
  },
  {
    "image": [
      4,
      33
    ],
    "key": "99",
    "name": "Vegetables",
    "type": 2
  },
  {
    "image": [
      5,
      33
    ],
    "key": "9a",
    "name": "VehicleParts",
    "type": 2
  },
  {
    "image": [
      6,
      33
    ],
    "key": "9b",
    "name": "VehicleParts2",
    "type": 2
  },
  {
    "image": [
      7,
      33
    ],
    "key": "9c",
    "name": "VehicleParts3",
    "type": 2
  },
  {
    "image": [
      1,
      34
    ],
    "key": "9d",
    "name": "Waste",
    "type": 3
  },
  {
    "cost": [
      {
        "count": 20,
        "key": "74",
        "name": "ConstructionParts"
      }
    ],
    "image": [
      2,
      34
    ],
    "key": "s",
    "name": "WasteDump",
    "recipe": {
      "key": "s"
    }
  },
  {
    "image": [
      3,
      34
    ],
    "key": "dk",
    "name": "WastePressed",
    "type": 2
  },
  {
    "cost": [
      {
        "count": 400,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      4,
      34
    ],
    "key": "6F",
    "name": "WasteSortingPlant",
    "recipe": {
      "key": "6F"
    }
  },
  {
    "image": [
      5,
      34
    ],
    "key": "9e",
    "name": "WasteWater",
    "type": 1
  },
  {
    "image": [
      6,
      34
    ],
    "key": "9f",
    "name": "Water",
    "type": 1
  },
  {
    "cost": [
      {
        "count": 40,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      7,
      34
    ],
    "key": "1I",
    "name": "WaterChiller",
    "recipe": {
      "key": "1I"
    }
  },
  {
    "cost": [
      {
        "count": 140,
        "key": "76",
        "name": "ConstructionParts3"
      }
    ],
    "image": [
      8,
      34
    ],
    "key": "O",
    "name": "WaterTreatmentPlant",
    "recipe": {
      "key": "O"
    }
  },
  {
    "image": [
      9,
      34
    ],
    "key": "9h",
    "name": "Wheat",
    "type": 3
  },
  {
    "image": [
      0,
      35
    ],
    "key": "9i",
    "name": "Wood",
    "type": 2
  },
  {
    "image": [
      1,
      35
    ],
    "key": "dl",
    "name": "Woodchips",
    "type": 3
  },
  {
    "image": [
      2,
      35
    ],
    "key": "9j",
    "name": "Worker",
    "type": 6,
    "type2": 7
  },
  {
    "image": [
      3,
      35
    ],
    "key": "dm",
    "name": "Yellowcake",
    "type": 3
  }
];
