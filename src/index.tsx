import React, { useState } from "react";
import {
  PluginClient,
  usePlugin,
  createState,
  useValue,
  Layout,
} from "flipper-plugin";
import { DatePicker, Switch, TimePicker, Typography } from "antd";

type Methods = {
  setDate: (date: Data) => Promise<any>;
};

type Events = {
  newDate: Data;
};

type Data = {
  date: number | undefined;
};

// Read more: https://fbflipper.com/docs/tutorial/js-custom#creating-a-first-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#pluginclient
export function plugin(client: PluginClient<Events, Methods>) {
  const data = createState<Data>({ date: undefined });

  function updateDate(newDate: Data) {
    data.update((draft) => {
      draft.date = newDate.date;
    });
  }

  client.onMessage("newDate", (newDate) => {
    console.log("newData", newDate);
    updateDate(newDate);
  });

  const setDate = async (date: number | undefined) => {
    const response = await client.send("setDate", { date });
    console.log(response);
    updateDate({ date });
  };

  console.log("plugin", data);

  return { data, setDate };
}

// Read more: https://fbflipper.com/docs/tutorial/js-custom#building-a-user-interface-for-the-plugin
// API: https://fbflipper.com/docs/extending/flipper-plugin#react-hooks
export function Component() {
  console.log("render");
  const instance = usePlugin(plugin);
  const data = useValue(instance.data);

  useState();

  console.log("Rendering", data);

  return (
    <Layout.Container pad gap>
      <Layout.Horizontal gap>
        <Typography.Title level={3}>Current date on client</Typography.Title>
        <Typography.Text>
          {data.date ? new Date(data.date).toISOString() : undefined}
        </Typography.Text>
      </Layout.Horizontal>
      <Layout.Horizontal gap>
        <Typography.Text strong>Mock the date</Typography.Text>
        <Switch
          checked={data.date != undefined}
          onChange={(checked) =>
            instance.setDate(checked ? Date.now() : undefined)
          }
        />
      </Layout.Horizontal>
      <Layout.Horizontal>
        <DatePicker onChange={(m) => instance.setDate(m?.valueOf())} showTime />
      </Layout.Horizontal>
    </Layout.Container>
  );
}
