import React, { PropsWithChildren, useState } from 'react';

type SnackBarContextType = {
	snackMessage: string;
	setSnackMessaage: (message: string) => void;
	snackOpen: boolean;
	setSnackOpen: (open: boolean) => void;
};

const initialContextValue = {
	snackMessage: '',
	setSnackMessaage: () => undefined,
	snackOpen: false,
	setSnackOpen: () => undefined
};

const SnackBarContext = React.createContext<SnackBarContextType>(initialContextValue);

export const SnackBarProvider: React.FC<PropsWithChildren> = ({
	children
}) => {
	const [message, setMessage] = useState('');
	const [open, setOpen] = useState(false);

	return (
		<SnackBarContext.Provider
			value={{
				snackMessage: message,
				setSnackMessaage: setMessage,
				snackOpen: open,
				setSnackOpen: setOpen
			}}
		>
			{children}
		</SnackBarContext.Provider>
	);
};

export const useSnackBar = (): SnackBarContextType => React.useContext(SnackBarContext);
