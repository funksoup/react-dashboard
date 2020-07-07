import * as React from 'react';
import { Fragment, useCallback, FC } from 'react';
import classnames from 'classnames';
import { BulkDeleteButton, List } from 'react-admin';
import { Route, RouteChildrenProps, useHistory } from 'react-router-dom';
import { Drawer, useMediaQuery, makeStyles, Theme } from '@material-ui/core';
import BulkAcceptButton from './BulkAcceptButton';
import BulkRejectButton from './BulkRejectButton';
import ReviewListMobile from './ReviewListMobile';
import ReviewListDesktop from './ReviewListDesktop';
import ReviewFilter from './ReviewFilter';
import ReviewEdit from './ReviewEdit';
import { BulkActionProps, ListComponentProps } from '../types';

const ReviewsBulkActionButtons: FC<BulkActionProps> = props => (
    <Fragment>
        <BulkAcceptButton {...props} />
        <BulkRejectButton {...props} />
        <BulkDeleteButton {...props} />
    </Fragment>
);

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    list: {
        flexGrow: 1,
        transition: theme.transitions.create(['all'], {
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginRight: 0,
    },
    listWithDrawer: {
        marginRight: 400,
    },
    drawerPaper: {
        zIndex: 100,
    },
}));

const ReviewList: FC<ListComponentProps<{ id: string }>> = props => {
    const classes = useStyles();
    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('xs')
    );
    const history = useHistory();

    const handleClose = useCallback(() => {
        history.push('/reviews');
    }, [history]);

    return (
        <div className={classes.root}>
            <Route path="/reviews/:id">
                {({ match }: RouteChildrenProps<{ id: string }>) => {
                    const isMatch = !!(
                        match &&
                        match.params &&
                        match.params.id !== 'create'
                    );

                    return (
                        <Fragment>
                            <List
                                {...props}
                                className={classnames(classes.list, {
                                    [classes.listWithDrawer]: isMatch,
                                })}
                                bulkActionButtons={<ReviewsBulkActionButtons />}
                                filters={<ReviewFilter />}
                                perPage={25}
                                sort={{ field: 'date', order: 'DESC' }}
                            >
                                {isXSmall ? (
                                    <ReviewListMobile />
                                ) : (
                                    <ReviewListDesktop
                                        selectedRow={
                                            isMatch
                                                ? parseInt(
                                                      (match as any).params.id,
                                                      10
                                                  )
                                                : undefined
                                        }
                                    />
                                )}
                            </List>
                            <Drawer
                                variant="persistent"
                                open={isMatch}
                                anchor="right"
                                onClose={handleClose}
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                            >
                                {/* To avoid any errors if the route does not match, we don't render at all the component in this case */}
                                {isMatch ? (
                                    <ReviewEdit
                                        id={(match as any).params.id}
                                        onCancel={handleClose}
                                        {...props}
                                    />
                                ) : null}
                            </Drawer>
                        </Fragment>
                    );
                }}
            </Route>
        </div>
    );
};

export default ReviewList;
