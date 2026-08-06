
## Overview 
This repository contains a project to replace the current MASCOT Map created by DataBC. It is built with **React** and **Open Layers**. It is designed to replicate the original MASCOT Web Map (https://maps.gov.bc.ca/ess/hm/geonetbc/), but written with opensource languages.

## Project Structure 
>[!info]
>THIS IS A WORK IN PROGRESS - SUBJECT TO CHANGE
>

```
geonetbcmap/
├── LICENSE
├── package.json
├── README.md
├── tsconfig.json
├── webpack.config.cjs
├── public/
│   └── index.html
├── src/
│   ├── global.d.ts
│   ├── index.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   └── providers/
│   │       └── MapProvider.tsx
│   ├── context/
│   │   ├── MapContext.ts
│   │   └── UIContext.tsx
│   ├── features/
│   │   ├── drawing/
│   │   │   ├── DrawDropdown.tsx
│   │   │   ├── EditWidget.tsx
│   │   │   └── EraseTooltip.tsx
│   │   ├── gotopoint/
│   │   │   └── GoToPoint.tsx
│   │   ├── layers/
│   │   │   ├── BaseLayersComponent.tsx
│   │   │   ├── BaseLayerSwitcher.tsx
│   │   │   ├── ImageLayerComponent.tsx
│   │   │   ├── LayerControl.tsx
│   │   │   ├── Style.tsx
│   │   │   └── VectorLayersComponent.tsx
│   │   ├── legend/
│   │   │   └── Legend.tsx
│   │   ├── maps/
│   │   │   ├── MapInteractions.tsx
│   │   │   ├── OpenLayersMap.tsx
│   │   │   └── interactions/
│   │   │       ├── ClearInteraction.tsx
│   │   │       ├── ClickInteraction.tsx
│   │   │       ├── DrawInteraction.tsx
│   │   │       ├── EraseInteraction.tsx
│   │   │       ├── FeaturePopup.tsx
│   │   │       ├── MeasureInteraction.tsx
│   │   │       ├── ModifyInteraction.tsx
│   │   │       ├── SelectBoxInteraction.tsx
│   │   │       └── mapLayers.tsx
│   │   ├── measure/
│   │   │   └── MeasureTool.tsx
│   │   ├── navigation/
│   │   │   └── ResetExtent.tsx
│   │   ├── popup/
│   │   │   ├── PopUpComponent.tsx
│   │   │   └── PopUps.tsx
│   │   ├── print/
│   │   │   └── Print.tsx
│   │   ├── query/
│   │   │   ├── FeatureForm.tsx
│   │   │   ├── fields.ts
│   │   │   ├── query_styles.css
│   │   │   └── symbology_groups.ts
│   │   ├── ribbon/
│   │   │   ├── RibbonButtons.tsx
│   │   │   └── RibbonTabs.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── sidebar.tsx
│   └── styles/
│       ├── index.scss
│       └── styles.ts
```

## Set Up  
### WIP 
Note - it is recommended to have some sort of development environment like wsl to serve the application from during development or testing. 

1. Install wsl 
2. Clone the repository 
   >[! ]
   >```git 
   >git clone https://github.com/jordanjfoy/geonetbcmap.git   

3. Install curl 
   ```  sudo apt-get install curl ```
4. Install node version manager (nvm)
   ``` 
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
   ```
5.  Install npm
   ```bash 
   sudo apt update
   sudo apt upgrade
   sudo apt install nodejs
   sudo apt install npm
   ```
6. To run application - run this command from the ROOT  
   ```bash
   npm start
   ```
https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl


## Documentation 
Additional documentation can be found in the docs folder. 
This material is designed to go through step by step, and provides sign much more in depth guidance on how this project was created.

The docs folder includes 
docs/
├── 1. Technology Stack 
├── 2. Data Flow 
├── 3. Potential Troubleshooting Issues 
├── 4. Example Addition 
└── 5. Appendix 
