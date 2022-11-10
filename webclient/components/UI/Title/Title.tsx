import { Conditional } from "@core/react/conditional";

type TitleProps = {
  icon?: string;
  title: string;
  subtitle?: string;
};

const Title = ({ icon, title, subtitle }: TitleProps) => {
  return (
    <div className="mb-5">
      <h1 className="text-4xl dark:text-white">
        <Conditional if={icon !== undefined}>
          <>{icon}</>
        </Conditional>
        {title}
      </h1>
      <Conditional if={subtitle !== undefined}>
        <h4>{subtitle}</h4>
      </Conditional>
    </div>
  );
};

export default Title;
