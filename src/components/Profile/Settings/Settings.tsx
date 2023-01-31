import { FormControl, RadioGroup, Stack, ToggleButtonGroup } from '@mui/material';
import { useAppSelector } from '../../../app/hooks';
import PaletteOption from './Palette/Palette';
import './Settings.scss';
import ThemeOption from './Theme/Theme';

export default function Settings() {
    return (
        <article className="settings">
            <h1>Settings</h1>
            <section className="palettes">
                <h2>Change application color</h2>
                <Stack justifyContent="center">
                    <FormControl>
                        <RadioGroup name="palette">
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent="center"
                                gap={5}
                            >
                                <PaletteOption value="deepPurple" label="Deep purple" />
                                <PaletteOption value="indigo" label="Indigo" />
                                <PaletteOption value="blue" label="Blue" />
                                <PaletteOption value="green" label="Green" />
                                <PaletteOption value="amber" label="Amber" />
                                <PaletteOption value="pink" label="Pink" />
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </section>
            <section className="themes">
                <h2>Change theme</h2>
                <Stack justifyContent="center">
                    <FormControl>
                        <RadioGroup name="theme">
                            <Stack
                                direction="row"
                                flexWrap="wrap"
                                justifyContent="center"
                                gap={5}
                            >
                                <ThemeOption iconColor="#ffd000" value="light" label="Light" icon="sun-o" />
                                <ThemeOption iconColor="#0095ff" value="dark" label="Dark" icon="moon-o" />
                            </Stack>
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </section>
        </article>
    )
}

function Form() {
    return FormControl
}