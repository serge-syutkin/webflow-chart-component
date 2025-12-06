---
title: How to import code components into Webflow
description: Import React components into Webflow with DevLink
hidden: false
subtitle: Import React components into Webflow with DevLink
---

In this quickstart guide, we’ll discuss how to import React components from an external codebase into Webflow using DevLink.

**What you'll accomplish:**
- Set up your development environment
- Declare a Webflow code component with props
- Import your component library to Webflow
- Use your component in a Webflow project

## Before you start

Before running this quickstart, make sure you have:

- A Webflow account with either:
    - a Workspace on a Freelancer, Core, Growth, Agency, or Enterprise plan
    - a Webflow site with a CMS, Business, or Enterprise plan
- A Webflow site where you can test components
- Node.js 20+ and npm 10+ installed
- Basic familiarity with React components and TypeScript


## 1. Setup your development environment
Set up your local development environment to create and share React components.

<Steps>
    <Step title="Setup your React project">
    DevLink is compatible with a wide variety of local setups. To get started, create a new React project. 
    
    **If you're working with an existing repository, you can skip this step.**
    
    ```bash
    npx create-react-app code-components
    cd code-components
    ```

    </Step>

    <Step title="Install the Webflow CLI">
    Install the Webflow CLI and the necessary dependencies to create a code component library.


        ```bash
        npm i --save-dev @webflow/webflow-cli @webflow/data-types @webflow/react

        ```
    </Step>
    <Step title="Create a Webflow configuration file">
    Create a `webflow.json` file in the root of your repository. This file will define the configuration for your code component library.

    ```json title={"webflow.json"}
    {
        "library": {
            "name": "<Your Library Name>",
            "components": ["./src/**/*.webflow. @(js|jsx|mjs|ts|tsx)"]
        }
    }
    
    ```


    Give your library a name and specify the path to your code component files.

    </Step>
    <Step title="Add an example component to your library">
    In your editor, navigate to your src or components directory. Create a new file called `Badge.tsx`, and paste the following code. In the next step, you'll create a code component definition file to map this component to a Webflow component.

    ```tsx title={"Badge.tsx"}
    import * as React from "react";
    
    interface BadgeProps {
      text: string;
      variant: 'Light' | 'Dark';
    }
    
    export const Badge = ({ text, variant }: BadgeProps) => (
      <span
        style={{
          backgroundColor: variant === 'Light' ? '#eee' : '#000',
          borderRadius: '1em',
          color: variant === 'Light' ? '#000' : '#fff',
          display: 'inline-block',
          fontSize: '14px',
          lineHeight: 2,
          padding: '0 1em',
        }}
      >
        {text}
      </span>
    );
    ```

    </Step>
</Steps>

## 2. Define a Webflow code component
Create a code component definition file to map a React component to a Webflow component. In this step, you'll create a `Badge` component with two props mapping to an example `Badge.tsx` component. 


<Steps>
    <Step title="Create a code component file">
    In your editor, navigate to the your `src` or components directory where you added your Badge component. Create a new file called `Badge.webflow.tsx`. This file will define how your Badge component appears in Webflow.

    </Step>

    <Step title="Import the React component and Webflow functions">
    Import the necessary dependencies to create your code component: the React component, [prop types](/code-components/reference/prop-types) and the `declareComponent` function.

    ```tsx title={"Badge.webflow.tsx"}
    import { Badge } from './Badge'; // Import your React component here
    import { props } from ' @webflow/data-types';
    import { declareComponent } from ' @webflow/react';
    
    ```



    </Step>
    <Step title="Declare the component">
    Declare the code component using the `declareComponent` function. 

    ```tsx title={"Badge.webflow.tsx"}
    import { Badge } from './Badge';
    import { props } from ' @webflow/data-types';
    import { declareComponent } from ' @webflow/react';
    
    export default declareComponent(Badge, {
        name: 'Badge',
        description: 'A badge with variants',
        group: 'Info',
    });
    ```


    The `declareComponent` function takes two parameters:
    - Your React component (`Badge`)
    - Configuration options:
        - `name`: The name of the component
        - `description?`: A description of the component (optional)
        - `group?`: The group the component belongs to (optional)
        - `props?`: The props of the component, **which we'll define in the next step.** (optional)
        - `options?`: The options of the component, (optional)

    For more information and detailed configuration options for code component imports, see the [component definition reference](/code-components/define-code-component).

    </Step>
    <Step title="Define the component props">
    Add configurable properties that users can edit in the Webflow designer. 
    
    Add a `props` object to the `declareComponent` function. This object defines which properties designers can configure in the Webflow editor, and maps them to appropriate Webflow prop types using the `props` constructor.

    ```tsx title={"Badge.webflow.tsx"}
    import { Badge } from './Badge';
    import { props } from ' @webflow/data-types';
    import { declareComponent } from ' @webflow/react';
    
    export default declareComponent(Badge, {
        name: 'Badge',
        description: 'A badge with variants',
        group: 'Info',
        props: {
            text: props.Text({
                name: "Text",
                defaultValue: "Hello World",
            }),
            variant: props.Variant({
                name: "Variant",
                options: ["Light", "Dark"],
                defaultValue: "Light",
            }),
        },
    });
    ```

    
        This code component defines two props:
        - `text`: A text field for the Badge content
        - `variant`: A dropdown with predefined style options

    </Step>
</Steps>

## 3. Share your library to Webflow

    In your terminal, run the following command to upload your library:

    ```bash
    npx webflow library share
    ```

    The Webflow CLI will:
        - **Authorize your workspace:** The CLI will check for a Workspace authentication token in your `.env` file. If one is not found, the CLI will prompt you to authenticate by opening a browser window to the Workspace authorization page. **Authorize a workspace to continue.**
        - **Bundle your library:** The CLI will bundle your library, and ask you to confirm the components you want to share. 
        - **Upload your library to your Workspace**
        
    For more information and detailed configuration options for bundling and importing React components, see the [bundling and import reference. →](/code-components/bundling-and-import)

## 4. Use the component on your Webflow site
Add your component to the canvas and update the props to customize the component.

<Steps>
    <Step title="Install the library on your Webflow site">
    Install the library on any site in your Workspace to start using your React components.

        1. Open any Webflow site in your workspace. 
        2. Open the Libraries panel by pressing "L" or clicking the <img src="https://dhygzobemt712.cloudfront.net/Icons/Light/32px/Resources.png" alt="Resources icon" style={{ display: "inline-block", verticalAlign: "text-bottom", width: 20, height: 20, margin: "0 2px" }} /> icon in the left sidebar.

            <div style={{width:"50%"}}>
                <Frame>
                    <img src="file:7d9b3245-2f02-450f-9e4a-4fbddb0dcd69" alt="Available to install" />
                </Frame>
            </div>

        3. Find your library in the list of available libraries.
        4. Install the library by clicking the **Install** icon next to your library.

    </Step>
    <Step title="Open the Components panel">
    Open the Components panel by pressing "⇧C" or clicking the 
    <img src="https://dhygzobemt712.cloudfront.net/Icons/Light/32px/Components.svg" alt="Components icon" style={{ display: "inline-block", verticalAlign: "text-bottom", width: 20, height: 20, margin: "0 2px" }} /> icon in the left sidebar.

    Scroll to the section for the library you just installed. You should see your "Badge" component listed under the "Info" group.

    <Frame  >
        <img src="file:7f53af4c-1f67-4111-9dbf-35305e04a82b" alt="Components panel" />
    </Frame>


    </Step>
    <Step title="Add the component to your page">

        Click and drag the Badge component from the components panel onto your page. The component will appear with its default text and styling.
    </Step>
    
    <Step title="Customize the component">
    Customize your component in the Properties panel on the right. You'll see two configurable properties:

    - **Text**: Change the text content of the Badge
    - **Variant**: Select from Light or Dark styling

    <Frame>
        <img src="file:453a7efb-46cb-4117-a3a7-59989d054df8" alt="Badge component" />
    </Frame>

    Try changing the text to "Welcome!" and selecting a different variant to see your component update in real-time.

    </Step>
</Steps>


## Congratulations
You've successfully created and shared a code component library for your Webflow projects! You now know how to:

- Set up a development environment for React components
- Declare a Webflow React component with configurable properties
- Share component libraries to Webflow via DevLink
- Use custom components in your Webflow projects


## Next steps

Now that you've created your first code component, explore these resources to build more advanced components:

### Learn the fundamentals
- [**Define a code component**](/code-components/define-code-component)<br/>
    Learn how code components work and their architecture
- [**Explore prop types**](/code-components/reference/prop-types)<br/>
    Explore all available prop types for creating configurable components
- [**Learn about the Webflow CLI**](/code-components/reference/cli)<br/>
    Learn more about the Webflow CLI commands

### Advanced configuration
- [**Installation and setup**](/code-components/installation)<br/>
  Learn how to configure your existing codebase for component import.
- [**Configure code components to work with popular frameworks and libraries**](/code-components/frameworks-and-libraries)<br/>
  Learn how to use CSS frameworks like **Tailwind CSS**, tools like **Shadcn/UI**, and component libraries like **Material UI** with code components.
- [**Configure bundling and import**](/code-components/bundling-and-import)<br/>
  Explore advanced configuration options for bundling and importing React components.