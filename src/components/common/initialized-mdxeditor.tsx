import { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  ListsToggle,
} from "@mdxeditor/editor";
import { useTheme } from "@heroui/use-theme";

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  const { theme } = useTheme();
  let isDark = theme === "dark";

  return (
    <MDXEditor
      className={isDark ? "dark-theme dark-editor w-full" : "w-full"}
      contentEditableClassName="mdx-editor-lists p-0 m-0"
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CodeToggle />
            </>
          ),
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
